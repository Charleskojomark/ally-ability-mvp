-- =============================================
-- Migration 001: Users and RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE user_role AS ENUM ('learner', 'teacher', 'champion', 'moderator', 'admin', 'partner');
CREATE TYPE disability_type AS ENUM ('visual', 'hearing', 'cognitive', 'physical', 'none', 'prefer_not_to_say');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'learner',
  disability_type disability_type DEFAULT 'none',
  state TEXT,
  lga TEXT,
  preferred_language TEXT DEFAULT 'en',
  accessibility_prefs JSONB DEFAULT '{}',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Admins and moderators can read all profiles
CREATE POLICY "Admins and moderators can view all profiles" 
ON users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
  )
);
