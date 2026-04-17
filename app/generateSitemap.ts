import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';

interface Category {
  slug: string;
}

interface Post {
  slug: string;
}

interface UnderCategory {
  slug: string;
}

interface PostWithPosts {
  slug: string;
  posts: Post[];
}

async function generateSitemap(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categoriesResult = await sql<Category>`SELECT slug FROM category`;
    const postsResult = await sql<Post>`SELECT slug FROM post`;
    const underCategoriesResult = await sql<UnderCategory>`SELECT slug FROM under_category`;

    const categories = categoriesResult.rows;
    const postDetails = postsResult.rows;
    const underCategories = underCategoriesResult.rows;

    const fetchPosts = async (slug: string): Promise<Post[]> => {
      const result = await sql<PostWithPosts>`
        SELECT p.slug, json_agg(json_build_object('slug', pt.slug)) as posts
        FROM under_category uc
        JOIN post p ON p.under_category_id = uc.id
        LEFT JOIN post_details pt ON pt.post_id = p.id
        WHERE uc.slug = ${slug}
        GROUP BY p.id
      `;
      if (result.rows.length === 0) {
        throw new Error('error');
      }
      return result.rows.flatMap(row => row.posts || []);
    };

    const dynamicRoutes = [
      ...categories.map((category) => `https://maths-exams.com/category/${category.slug}`),
      ...postDetails.map((post) => `https://maths-exams.com/postdetails/${post.slug}`),
      ...underCategories.map((underCategory) => `https://maths-exams.com/category/${underCategory.slug}/posts`)
    ];

    const staticRoutes = [
      'https://maths-exams.com/about',
      'https://maths-exams.com/contactus',
      'https://maths-exams.com/privacypolicy',
    ];

    const allRoutes = [...dynamicRoutes, ...staticRoutes];

    const smStream = new SitemapStream({ hostname: 'https://maths-exams.com' });
    const pipeline = smStream.pipe(createGzip());

    smStream.write({ url: '/', changefreq: 'daily', priority: 0.9 });

    allRoutes.forEach(route => {
      smStream.write({ url: route, changefreq: 'daily', priority: 0.7 });
    });

    smStream.end();

    const sitemap = await streamToPromise(pipeline);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Encoding', 'gzip');

    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

export default generateSitemap;
