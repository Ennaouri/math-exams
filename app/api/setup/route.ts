import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create category table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        thumbnail TEXT,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create under_category table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS under_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        thumbnail TEXT,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category_id INTEGER REFERENCES category(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create post table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        thumbnail TEXT,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        under_category_id INTEGER REFERENCES under_category(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create post_details table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_details (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        thumbnail TEXT,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        post_id INTEGER REFERENCES post(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update('admin').digest('hex');
    await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['admin@example.com', hash, 'Admin', 'admin']
    );

    return NextResponse.json({ success: true, message: 'Database tables created!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}