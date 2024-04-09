import axios from 'axios';
import { js2xml, Element as XmlElement } from 'xml-js';
import fs from 'fs';

async function fetchUrls(): Promise<string[]> {
  try {
    const response = await axios.get('http://localhost:3000/your-api-endpoint');
    return response.data.urls;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return [];
  }
}

async function generateSitemap() {
  const urls = await fetchUrls();

  const urlset = {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'UTF-8'
      }
    },
    urlset: {
      _attributes: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
      },
      url: urls.map(url => ({
        loc: { _text: url },
        lastmod: { _text: new Date().toISOString() },
        changefreq: { _text: 'weekly' },
        priority: { _text: '0.8' }
      }))
    }
  };

  const xml = js2xml(urlset, { compact: true, spaces: 2 });

  fs.writeFileSync('./public/sitemap.xml', xml);
}

generateSitemap().then(() => {
  console.log('Sitemap generated successfully.');
}).catch(error => {
  console.error('Error generating sitemap:', error);
});
