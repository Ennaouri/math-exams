// generateSitemap.ts

import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import path from 'path';

async function generateSitemap(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    
    // Initialize sitemap stream
    const smStream = new SitemapStream({ hostname: 'https://maths-exams.com' }); // Update with your actual hostname
    const pipeline = smStream.pipe(createGzip());

    // Add static routes
    smStream.write({ url: '/', changefreq: 'daily', priority: 0.9 }); // Example static route

    // Add dynamic routes
    allRoutes.forEach(route => {
      smStream.write({ url: route, changefreq: 'daily', priority: 0.7 }); // You can adjust changefreq and priority as needed
    });

    // End sitemap stream
    smStream.end();

    // Generate XML
    const sitemap = await streamToPromise(pipeline);

      // Convert the stream to a string
      const xmlString = await streamToPromise(smStream).then(data => data.toString());

      // Write the XML string to a file in the public folder
      const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
      fs.writeFileSync(filePath, xmlString);
    
    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Encoding', 'gzip');

    // Send sitemap XML
    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

export default generateSitemap;

