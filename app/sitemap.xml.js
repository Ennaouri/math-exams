// pages/sitemap.xml.js

import { createSitemap } from 'next-sitemap';

export default async function Sitemap() {
   // Fetch your website's routes from Prisma (adjust the query as needed)
   const categories = await prisma.category.findMany();
   const postDetails = await prisma.post.findMany();

  const dynamicRoutes = [
    // Generate URLs for categories
    ...categories.map((category) => ({
      loc: `https://maths-exams.com/category/${category.slug}`,
      lastmod: new Date().toISOString(),
    })),
    // Generate URLs for post details
    ...postDetails.map((post) => ({
      loc: `https://maths-exams.com/postdetails/${post.slug}`,
      lastmod: new Date().toISOString(),
    })),
  ];

  // Static routes
  const staticRoutes = [
    { loc: 'https://maths-exams.com/about', lastmod: new Date().toISOString() },
    { loc: 'https://maths-exams.com/contactus', lastmod: new Date().toISOString() },
    { loc: 'https://maths-exams.com/privacypolicy', lastmod: new Date().toISOString() },
  ];

  // Combine dynamic and static routes
  const allRoutes = [...dynamicRoutes, ...staticRoutes];

    // Generate sitemap
    return createSitemap({
        baseUrl: 'https://maths-exams.com',
        routes: allRoutes,
        isTrailingSlashRequired: false,
        targetDirectory: '/public/',
        pagesDirectory: __dirname + '/app',
      });
}
