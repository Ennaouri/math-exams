import { sql } from '@/lib/db';
import { GetServerSideProps } from "next";

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
  const categoriesResult = await sql`SELECT slug FROM category`;
  const postsResult = await sql`SELECT slug FROM post`;

  const dynamicRoutes = [
    ...categoriesResult.rows.map((c) => `https://maths-exams.com/category/${c.slug}`),
    ...postsResult.rows.map((p) => `https://maths-exams.com/postdetails/${p.slug}`),
  ];

  const staticRoutes = [
    'https://maths-exams.com/about',
    'https://maths-exams.com/contactus',
    'https://maths-exams.com/privacypolicy',
  ];

  const allRoutes = [...dynamicRoutes, ...staticRoutes];

  return `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes.map((url) => `<url><loc>${url}</loc></url>`).join('')}
  </urlset>
  `;
}
