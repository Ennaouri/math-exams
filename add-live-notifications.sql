-- Table pour stocker les inscriptions aux rappels de lives
CREATE TABLE IF NOT EXISTS live_notification (
  id          SERIAL PRIMARY KEY,
  live_id     INTEGER REFERENCES live_session(id) ON DELETE CASCADE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email       VARCHAR(255) NOT NULL,
  user_name   VARCHAR(255),
  notified    BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(live_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_live_notif_live_id ON live_notification(live_id);
CREATE INDEX IF NOT EXISTS idx_live_notif_notified ON live_notification(notified);
