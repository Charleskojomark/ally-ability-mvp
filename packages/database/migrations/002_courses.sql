-- =============================================
-- Migration 002: Courses and Content with RLS
-- The Ally-Ability Network
-- =============================================

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE accessibility_level AS ENUM ('basic', 'standard', 'gold');

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT,
  accessibility_level accessibility_level DEFAULT 'basic',
  has_nsl BOOLEAN DEFAULT false,
  has_audio_description BOOLEAN DEFAULT false,
  has_captions BOOLEAN DEFAULT false,
  is_offline_ready BOOLEAN DEFAULT false,
  status content_status DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  nsl_video_url TEXT,
  transcript TEXT,
  vtt_captions_url TEXT,
  duration_seconds INTEGER,
  order_index INTEGER NOT NULL,
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can read published courses
CREATE POLICY "Anyone can view published courses" 
ON courses FOR SELECT 
USING (status = 'published');

-- Anyone can read modules for published courses
CREATE POLICY "Anyone can view modules for published courses" 
ON modules FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = modules.course_id AND status = 'published'
  )
);

-- Anyone can read lessons for published courses
CREATE POLICY "Anyone can view lessons for published courses" 
ON lessons FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM modules 
    JOIN courses ON courses.id = modules.course_id 
    WHERE modules.id = lessons.module_id AND courses.status = 'published'
  )
);

-- Admins and teachers can manage all course content
CREATE POLICY "Admins and teachers can manage courses" 
ON courses FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  )
);

CREATE POLICY "Admins and teachers can manage modules" 
ON modules FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  )
);

CREATE POLICY "Admins and teachers can manage lessons" 
ON lessons FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  )
);
