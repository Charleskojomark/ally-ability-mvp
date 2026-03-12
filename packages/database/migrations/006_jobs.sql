-- =============================================
-- Migration 006: Remote Work Portal with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE job_status AS ENUM ('open', 'closed', 'filled');

CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  website TEXT,
  is_inclusive_certified BOOLEAN DEFAULT false,
  certified_at TIMESTAMPTZ,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id),
  title TEXT NOT NULL,
  description TEXT,
  skills_required TEXT[],
  is_micro_internship BOOLEAN DEFAULT false,
  duration_weeks INTEGER,
  stipend_ngn INTEGER,
  status job_status DEFAULT 'open',
  apply_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_job_listings_employer ON job_listings(employer_id);
CREATE INDEX idx_job_listings_status ON job_listings(status);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view employers
CREATE POLICY "Anyone can view employers" 
ON employers FOR SELECT 
USING (true);

-- Anyone can view open jobs
CREATE POLICY "Anyone can view open jobs" 
ON job_listings FOR SELECT 
USING (status = 'open');

-- Admins can manage all jobs and employers
CREATE POLICY "Admins can manage employers" 
ON employers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage job listings" 
ON job_listings FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);
