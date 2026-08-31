import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query   = (searchParams.get('q') || '').trim();
    const niveau  = searchParams.get('niveau') || '';     // category slug
    const type    = searchParams.get('type') || '';       // attribute: cours|exercices|examen|devoir
    const semestre = searchParams.get('semestre') || '';  // '1' | '2'
    const sort    = searchParams.get('sort') || 'recent'; // 'recent' | 'name'
    const page    = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit   = 18;
    const offset  = (page - 1) * limit;

    // Must have at least a query OR a filter
    if (!query && !niveau && !type && !semestre) {
      return NextResponse.json({ results: [], total: 0, page: 1, totalPages: 0 });
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (query && query.length >= 2) {
      const pattern = `%${query}%`;
      conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx} OR p.slug ILIKE $${idx} OR uc.name ILIKE $${idx} OR c.name ILIKE $${idx})`);
      values.push(pattern);
      idx++;
    }

    if (niveau) {
      conditions.push(`c.slug = $${idx}`);
      values.push(niveau);
      idx++;
    }

    if (type) {
      conditions.push(`LOWER(p.attribute) = $${idx}`);
      values.push(type.toLowerCase());
      idx++;
    }

    if (semestre) {
      conditions.push(`p.semestre = $${idx}`);
      values.push(parseInt(semestre, 10));
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = sort === 'name' ? 'p.name ASC' : 'p.created_at DESC';

    // Count total
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM "Post" p
       LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
       LEFT JOIN "Category"      c  ON c.id  = uc.category_id
       ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].count, 10);

    // Main query
    values.push(limit, offset);
    const result = await pool.query(
      `SELECT
         p.id, p.name, p.slug, p.description, p.thumbnail, p.attribute,
         p.semestre, p.created_at,
         uc.id   AS under_category_id,
         uc.name AS under_category_name,
         uc.slug AS under_category_slug,
         c.id    AS category_id,
         c.name  AS category_name,
         c.slug  AS category_slug
       FROM "Post" p
       LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
       LEFT JOIN "Category"      c  ON c.id  = uc.category_id
       ${whereClause}
       ORDER BY ${orderClause}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    return NextResponse.json({
      results: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [], total: 0, page: 1, totalPages: 0 });
  }
}