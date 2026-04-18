import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

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
    const categoriesResult = await pool.query<Category>('SELECT slug FROM category');
    const postsResult = await pool.query<Post>('SELECT slug FROM post');
    const underCategoriesResult = await pool.query<UnderCategory>('SELECT slug FROM under_category');

    const categories = categoriesResult.rows;
    const postDetails = postsResult.rows;
    const underCategories = underCategoriesResult.rows;

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