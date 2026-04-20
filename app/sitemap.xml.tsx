import { pool } from '@/lib/db';
import { GetServerSideProps } from "next";

interface Category {
  slug: string;
  created_at?: Date;
}

interface Post {
  slug: string;
  created_at?: Date;
}

export default function Sitemap(){
  return null;
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  ctx.res.setHeader('Content-Type', 'text/xml')
  const xml = await generateSitemap()
  ctx.res.write('')
  ctx.res.end()

  return {
    props: {}
  }
}

async function generateSitemap():  Promise<string>{
  const categoriesResult = await pool.query<Category>('SELECT slug, created_at FROM "Category"');
  const postsResult = await pool.query<Post>('SELECT slug, created_at FROM "Post"');

  interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
}

const staticRoutes: SitemapUrl[] = [
    { loc: 'https://maths-exams.com', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://maths-exams.com/about', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://maths-exams.com/contactus', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://maths-exams.com/privacypolicy', priority: '0.3', changefreq: 'monthly' },
  ];

  const categoryRoutes = categoriesResult.rows.map((c) => ({
    loc: `https://maths-exams.com/category/${c.slug}`,
    lastmod: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const postRoutes = postsResult.rows.map((p) => ({
    loc: `https://maths-exams.com/postdetails/${p.slug}`,
    lastmod: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes.map((url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;
}