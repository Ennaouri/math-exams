-- ==============================================================================
-- Schema V2 : Abonnements, Formations, Lives, Parents & Étudiants
-- ==============================================================================

-- 1. Table des utilisateurs (enrichie si pas encore créée)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'etudiant', -- 'admin', 'etudiant', 'parent', 'enseignant', 'user'
  niveau VARCHAR(100), -- 'tronc-commun', '1bac-sm', '1bac-exp', '2bac-sm', '2bac-pc', '2bac-svt', 'concours'
  phone VARCHAR(50),
  image VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Relation Parents - Étudiants
CREATE TABLE IF NOT EXISTS parent_student (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, student_id)
);

-- 3. Plans d'abonnements
CREATE TABLE IF NOT EXISTS subscription_plan (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  niveau VARCHAR(100) NOT NULL,
  level_label VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  billing_period VARCHAR(50) NOT NULL, -- 'mensuel', 'trimestriel', 'annuel'
  description TEXT,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Souscriptions des utilisateurs (Étudiants / Parents)
CREATE TABLE IF NOT EXISTS user_subscription (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plan(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'active', 'pending', 'expired', 'cancelled'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'virement',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Formations complètes
CREATE TABLE IF NOT EXISTS formation (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  niveau VARCHAR(100) NOT NULL,
  niveau_label VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES category(id),
  thumbnail VARCHAR(500),
  is_premium BOOLEAN DEFAULT true,
  instructor_name VARCHAR(255) DEFAULT 'Professeur Maths-Exams',
  total_hours INTEGER DEFAULT 20,
  total_chapters INTEGER DEFAULT 8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Séances de cours en direct (Lives)
CREATE TABLE IF NOT EXISTS live_session (
  id SERIAL PRIMARY KEY,
  formation_id INTEGER REFERENCES formation(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  niveau VARCHAR(100) NOT NULL,
  niveau_label VARCHAR(255) NOT NULL,
  instructor_name VARCHAR(255) DEFAULT 'Professeur Maths-Exams',
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  meeting_url VARCHAR(500),
  replay_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Ressources téléchargeables (Cours, Séries, Devoirs corrigés)
CREATE TABLE IF NOT EXISTS formation_resource (
  id SERIAL PRIMARY KEY,
  formation_id INTEGER REFERENCES formation(id) ON DELETE CASCADE,
  live_session_id INTEGER REFERENCES live_session(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'cours', 'exercices', 'correction', 'devoir'
  is_premium BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
