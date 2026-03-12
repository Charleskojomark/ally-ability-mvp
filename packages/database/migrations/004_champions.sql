-- =============================================
-- Migration 004: Champions and Mentorship with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE session_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE session_channel AS ENUM ('in_app', 'whatsapp', 'telegram');

CREATE TABLE champion_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  specialisations TEXT[],
  languages TEXT[],
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  compensation_per_session_ngn INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  champion_id UUID REFERENCES users(id),
  teacher_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  channel session_channel DEFAULT 'in_app',
  status session_status DEFAULT 'pending',
  jitsi_room_name TEXT,
  notes TEXT,
  teacher_rating INTEGER,
  teacher_feedback TEXT,
  amount_ngn INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_champion_profiles_user_id ON champion_profiles(user_id);
CREATE INDEX idx_mentorship_sessions_champion ON mentorship_sessions(champion_id);
CREATE INDEX idx_mentorship_sessions_teacher ON mentorship_sessions(teacher_id);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE champion_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can view champion profiles
CREATE POLICY "Anyone can view champion profiles" 
ON champion_profiles FOR SELECT 
USING (true);

-- Champions can update their own profile
CREATE POLICY "Champions can update own profile" 
ON champion_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Involved parties can view their sessions
CREATE POLICY "Users can view own sessions" 
ON mentorship_sessions FOR SELECT 
USING (auth.uid() = champion_id OR auth.uid() = teacher_id);

-- Involved parties can update their sessions
CREATE POLICY "Users can update own sessions" 
ON mentorship_sessions FOR UPDATE 
USING (auth.uid() = champion_id OR auth.uid() = teacher_id);

-- Users can insert sessions they are requesting
CREATE POLICY "Teachers can request sessions" 
ON mentorship_sessions FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

-- Admins can view all sessions and profiles
CREATE POLICY "Admins can view all champion data" 
ON champion_profiles FOR ALL 
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view all session data" 
ON mentorship_sessions FOR ALL 
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
