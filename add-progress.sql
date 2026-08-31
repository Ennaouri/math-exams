-- ==============================================================================
-- Migration : Suivi de progression des étudiants
-- ==============================================================================

CREATE TABLE IF NOT EXISTS user_progress (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id     INTEGER REFERENCES "Post"(id) ON DELETE CASCADE,
  post_slug   VARCHAR(255) NOT NULL,
  post_name   VARCHAR(500),
  category_name VARCHAR(255),
  category_slug VARCHAR(255),
  viewed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_viewed_at ON user_progress(viewed_at DESC);
