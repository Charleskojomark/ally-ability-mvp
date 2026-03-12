-- =============================================
-- Migration 005: Safety Reporting with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE report_status AS ENUM ('submitted', 'under_review', 'resolved', 'escalated');
CREATE TYPE report_severity AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  severity report_severity DEFAULT 'medium',
  status report_status DEFAULT 'submitted',
  assigned_moderator_id UUID REFERENCES users(id),
  moderator_notes TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_safety_reports_reporter ON safety_reports(reporter_id);
CREATE INDEX idx_safety_reports_status ON safety_reports(status);
CREATE INDEX idx_safety_reports_severity ON safety_reports(severity);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can submit a report
CREATE POLICY "Users can submit reports" 
ON safety_reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

-- Reporters can view their own reports
CREATE POLICY "Users can view own reports" 
ON safety_reports FOR SELECT 
USING (auth.uid() = reporter_id);

-- Moderators and Admins can view and update all reports
CREATE POLICY "Moderators can view all reports" 
ON safety_reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
  )
);

CREATE POLICY "Moderators can update all reports" 
ON safety_reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
  )
);
