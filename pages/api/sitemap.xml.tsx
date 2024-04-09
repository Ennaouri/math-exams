// Import built-in types for API routes
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise, EnumChangefreq } from 'sitemap';
import { createGzip } from 'zlib';

const prisma = new PrismaClient()
const fetchPosts = async() =>{
    const posts = await prisma.post.findMany({
    })
    if(!posts){
        throw new Error("error")
    }
    return posts
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

	if (!res) return {};
	try {
	    // Set response header 
		res.setHeader('content-type', 'application/xml');
		res.setHeader('Content-Encoding', 'gzip');
		
		// A Transform for turning a Readable stream of either SitemapItemOptions or url strings into a Sitemap.
		// The readable stream it transforms must be in object mode.
		const smStream = new SitemapStream({
			hostname: 'http://localhost:3000',
		});
		
		const pipeline = smStream.pipe(createGzip());
		// Add any static entries here
		smStream.write({ url: '/', lastmod: process.env.siteUpdatedAt, changefreq: EnumChangefreq.WEEKLY });
		smStream.write({ url: '/about', lastmod: process.env.siteUpdatedAt, changefreq: EnumChangefreq.MONTHLY });
		smStream.write({ url: '/contact', lastmod: process.env.siteUpdatedAt, changefreq: EnumChangefreq.MONTHLY });
		// E.g. we create a sitemap.xml for articles
		// Set articles change frequencey is weekly
		const articles = await fetchPosts()
		articles.map(article => {
			smStream.write({
				url: `/article/${article.id}/${article.slug}`,
				lastmod: article.updated_at,
				changefreq: EnumChangefreq.WEEKLY,
			});
		});
		smStream.end();

		// cache the response
		// streamToPromise.then(sm => sitemap = sm)
		streamToPromise(pipeline);
		// stream the response
		pipeline.pipe(res).on('error', e => {
			throw e;
		});
	} catch (e) {
		res.status(500).end();
	}
};