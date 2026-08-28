/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://maths-exams.com',
  generateRobotsTxt: false, // We manage robots.txt manually in public/robots.txt
  exclude: [
    '/admin',
    '/admin/*',
    '/login',
    '/profile',
    '/reset-password',
    '/verify-email',
    '/test-upload',
    '/api/*',
  ],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  // The primary sitemap is generated dynamically via app/sitemap.ts
  // This config is used as a backup / for the next-sitemap CLI
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/methodologie-bac'),
    await config.transform(config, '/equipe-pedagogique'),
    await config.transform(config, '/contactus'),
  ],
};