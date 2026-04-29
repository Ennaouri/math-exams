import type { MetadataRoute } from "next";
import { pool } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

type SitemapRow = {
  url: string;
  updated_at?: Date | string | null;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

function toSitemapEntry(row: SitemapRow): MetadataRoute.Sitemap[number] {
  return {
    url: row.url,
    lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
    changeFrequency: row.changeFrequency,
    priority: row.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoriesResult, underCategoriesResult, postsResult] = await Promise.all([
    pool.query<{ slug: string; updated_at?: Date }>('SELECT slug, updated_at FROM "Category"'),
    pool.query<{ category_slug: string; slug: string; updated_at?: Date }>(`
      SELECT c.slug AS category_slug, uc.slug, uc.updated_at
      FROM "UnderCategory" uc
      JOIN "Category" c ON c.id = uc.category_id
    `),
    pool.query<{ slug: string; updated_at?: Date }>('SELECT slug, updated_at FROM "Post"'),
  ]);

  const staticRoutes: SitemapRow[] = [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: "daily" },
    { url: `${SITE_URL}/methodologie-bac`, priority: 0.75, changeFrequency: "monthly" },
    { url: `${SITE_URL}/equipe-pedagogique`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${SITE_URL}/contactus`, priority: 0.4, changeFrequency: "monthly" },
  ];

  const categoryRoutes: SitemapRow[] = categoriesResult.rows.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    updated_at: category.updated_at,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const underCategoryRoutes: SitemapRow[] = underCategoriesResult.rows.map((underCategory) => ({
    url: `${SITE_URL}/category/${underCategory.category_slug}/${underCategory.slug}`,
    updated_at: underCategory.updated_at,
    priority: 0.85,
    changeFrequency: "weekly",
  }));

  const postRoutes: SitemapRow[] = postsResult.rows.map((post) => ({
    url: `${SITE_URL}/postdetails/${post.slug}`,
    updated_at: post.updated_at,
    priority: 0.9,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...categoryRoutes, ...underCategoryRoutes, ...postRoutes].map(toSitemapEntry);
}
