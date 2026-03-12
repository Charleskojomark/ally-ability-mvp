-- =============================================
-- Migration 007: Certifications with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  badge_url TEXT,
  verification_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT
);

-- Indexes
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_type ON certificates(type);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can verify/view certificates (useful for employers)
CREATE POLICY "Anyone can view certificates" 
ON certificates FOR SELECT 
USING (true);

-- Only admins/system can issue certificates
CREATE POLICY "Admins can manage certificates" 
ON certificates FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);
