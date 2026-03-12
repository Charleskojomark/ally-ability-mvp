-- =============================================
-- Migration 008: Ally-Engine API Partners with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE partner_tier AS ENUM ('free', 'starter', 'growth', 'enterprise');

CREATE TABLE api_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  api_key TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  tier partner_tier DEFAULT 'free',
  features_enabled JSONB DEFAULT '{ "nsl": true, "ui_skin": true, "screen_reader": true }',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE widget_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES api_partners(id),
  event_type TEXT NOT NULL,
  session_id TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_api_partners_api_key ON api_partners(api_key);
CREATE INDEX idx_widget_events_partner ON widget_events(partner_id);
CREATE INDEX idx_widget_events_type ON widget_events(event_type);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE api_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_events ENABLE ROW LEVEL SECURITY;

-- Only Admins can manage API partners
CREATE POLICY "Admins can manage partners" 
ON api_partners FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only Admins can view widget events (analytics)
CREATE POLICY "Admins can view widget events" 
ON widget_events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can insert widget events (bypassing RLS via service key)
