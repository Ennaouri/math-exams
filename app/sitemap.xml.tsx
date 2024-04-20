

// pages/sitemap.xml.tsx

import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";

/* import { NextPage, GetServerSideProps } from 'next';
import { ServerResponse } from 'http'; // Import ServerResponse from 'http'
import { PrismaClient } from '@prisma/client';

const Sitemap: NextPage = () => null; // This page doesn't render anything, it will only generate and serve the sitemap

export const getServerSideProps: GetServerSideProps = async ({ res }: { res: ServerResponse }) => {
  const prisma = new PrismaClient()
  try {
  // Fetch your website's routes from Prisma (adjust the query as needed)
  const categories = await prisma.category.findMany();
  const postDetails = await prisma.post.findMany();

    // Dynamic routes
    const dynamicRoutes = [
      // Generate URLs for categories
      ...categories.map((category) => `https://maths-exams.com/category/${category.slug}`),
      // Generate URLs for post details
      ...postDetails.map((post) => `https://maths-exams.com/postdetails/${post.slug}`),
    ];

    // Static routes
    const staticRoutes = [
      'https://maths-exams.com/about',
      'https://maths-exams.com/contactus',
      'https://maths-exams.com/privacypolicy',
    ];

    // Combine dynamic and static routes
    const allRoutes = [...dynamicRoutes, ...staticRoutes];

    // Generate sitemap XML
    const sitemapXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allRoutes.map((url) => `<url><loc>${url}</loc></url>`).join('')}
      </urlset>
    `;

    // Set response headers
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapXml);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Returning an empty object because getServerSideProps requires a return value
  return { props: {} };
};

export default Sitemap; */

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
  const prisma = new PrismaClient()
  // Fetch your website's routes from Prisma (adjust the query as needed)
  const categories = await prisma.category.findMany();
  const postDetails = await prisma.post.findMany();

  const dynamicRoutes = [
    // Generate URLs for categories
    ...categories.map((category) => `https://maths-exams.com/category/${category.slug}`),
    // Generate URLs for post details
    ...postDetails.map((post) => `https://maths-exams.com/postdetails/${post.slug}`),
  ];

  

  // Static routes
  const staticRoutes = [
    'https://maths-exams.com/about',
    'https://maths-exams.com/contactus',
    'https://maths-exams.com/privacypolicy',
  ];

  // Combine dynamic and static routes
  const allRoutes = [...dynamicRoutes, ...staticRoutes];

  
  return   `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes.map((url) => `<url><loc>${url}</loc></url>`).join('')}
  </urlset>
  `;
}


