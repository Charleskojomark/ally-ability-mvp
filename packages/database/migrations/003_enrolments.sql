-- =============================================
-- Migration 003: Enrolments and Progress with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TABLE enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completion_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  accessibility_features_used JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_enrolments_user_id ON enrolments(user_id);
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can manage their own enrolments
CREATE POLICY "Users can manage own enrolments" 
ON enrolments FOR ALL 
USING (auth.uid() = user_id);

-- Users can manage their own lesson progress
CREATE POLICY "Users can manage own lesson progress" 
ON lesson_progress FOR ALL 
USING (auth.uid() = user_id);

-- Admins can view all enrolments and progress
CREATE POLICY "Admins can view all enrolments" 
ON enrolments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can view all lesson progress" 
ON lesson_progress FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);
