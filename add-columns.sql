-- Add metadata and image columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT;