-- =============================================
-- Seed Data for Development and Demo
-- The Ally-Ability Network
-- =============================================

-- =============================================
-- 1. Users
-- 1 admin, 1 moderator, 5 champions, 10 learners
-- Note: We use specific UUIDs to easily link relations below.
-- =============================================

-- Users: Admins & Staff
INSERT INTO users (id, email, full_name, role, disability_type) VALUES 
('a0000000-0000-0000-0000-000000000001', 'admin@ally-ability.ng', 'System Admin', 'admin', 'none'),
('a0000000-0000-0000-0000-000000000002', 'mod@ally-ability.ng', 'Safety Moderator', 'moderator', 'none');

-- Users: Champions (Mentors)
INSERT INTO users (id, email, full_name, role, disability_type) VALUES 
('c0000000-0000-0000-0000-000000000001', 'champ1@test.com', 'Grace O.', 'champion', 'visual'),
('c0000000-0000-0000-0000-000000000002', 'champ2@test.com', 'Eze N.', 'champion', 'physical'),
('c0000000-0000-0000-0000-000000000003', 'champ3@test.com', 'Amaka S.', 'champion', 'hearing'),
('c0000000-0000-0000-0000-000000000004', 'champ4@test.com', 'Bisi A.', 'champion', 'cognitive'),
('c0000000-0000-0000-0000-000000000005', 'champ5@test.com', 'Tunde M.', 'champion', 'none');

-- Users: Learners
INSERT INTO users (id, email, full_name, role, disability_type) VALUES 
('L0000000-0000-0000-0000-000000000001', 'learner1@test.com', 'Learner One', 'learner', 'visual'),
('L0000000-0000-0000-0000-000000000002', 'learner2@test.com', 'Learner Two', 'learner', 'hearing'),
('L0000000-0000-0000-0000-000000000003', 'learner3@test.com', 'Learner Three', 'learner', 'cognitive'),
('L0000000-0000-0000-0000-000000000004', 'learner4@test.com', 'Learner Four', 'learner', 'physical'),
('L0000000-0000-0000-0000-000000000005', 'learner5@test.com', 'Learner Five', 'learner', 'none'),
('L0000000-0000-0000-0000-000000000006', 'learner6@test.com', 'Learner Six', 'learner', 'visual'),
('L0000000-0000-0000-0000-000000000007', 'learner7@test.com', 'Learner Seven', 'learner', 'hearing'),
('L0000000-0000-0000-0000-000000000008', 'learner8@test.com', 'Learner Eight', 'learner', 'cognitive'),
('L0000000-0000-0000-0000-000000000009', 'learner9@test.com', 'Learner Nine', 'learner', 'physical'),
('L0000000-0000-0000-0000-000000000010', 'learner10@test.com', 'Learner Ten', 'learner', 'none');

-- =============================================
-- 2. Champion Profiles
-- =============================================

INSERT INTO champion_profiles (user_id, bio, specialisations, languages, rating, total_sessions) VALUES
('c0000000-0000-0000-0000-000000000001', 'Accessibility expert & frontend dev.', ARRAY['Web Accessibility', 'React'], ARRAY['English', 'Yoruba'], 4.9, 12),
('c0000000-0000-0000-0000-000000000002', 'Data scientist advocating for neurodiversity.', ARRAY['Data Analysis', 'Python'], ARRAY['English', 'Igbo'], 4.8, 8),
('c0000000-0000-0000-0000-000000000003', 'Sign language interpreter and graphic designer.', ARRAY['Design', 'NSL'], ARRAY['English', 'NSL'], 5.0, 25),
('c0000000-0000-0000-0000-000000000004', 'Digital marketing specialist.', ARRAY['Marketing', 'SEO'], ARRAY['English', 'Pidgin'], 4.7, 5),
('c0000000-0000-0000-0000-000000000005', 'Cloud architect and inclusive tech advocate.', ARRAY['Cloud', 'DevOps'], ARRAY['English', 'Hausa'], 4.9, 15);

-- =============================================
-- 3. Course: Digital Marketing for Small Businesses
-- =============================================

INSERT INTO courses (id, title, description, category, accessibility_level, has_nsl, has_captions, has_audio_description, status, created_by) VALUES
('b0000000-0000-0000-0000-000000000001', 'Digital Marketing for Small Businesses', 'Learn how to grow your business using free digital tools, WhatsApp, and social media.', 'Business', 'gold', true, true, true, 'published', 'a0000000-0000-0000-0000-000000000001');

-- Modules
INSERT INTO modules (id, course_id, title, order_index) VALUES
('m0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Foundations of Marketing', 1),
('m0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'WhatsApp Marketing Mastery', 2),
('m0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Online Sales and Customer Service', 3);

-- Lessons (Module 1)
INSERT INTO lessons (module_id, title, description, transcript, duration_seconds, order_index) VALUES
('m0000000-0000-0000-0000-000000000001', 'What is Digital Marketing?', 'An introduction to digital marketing concepts.', 'Welcome to digital marketing...', 300, 1),
('m0000000-0000-0000-0000-000000000001', 'Identifying Your Audience', 'How to know who your customers are.', 'To sell effectively...', 420, 2),
('m0000000-0000-0000-0000-000000000001', 'Building a Brand Identity', 'Creating a memorable brand for your business.', 'Your brand is more than just a logo...', 500, 3);

-- Lessons (Module 2)
INSERT INTO lessons (module_id, title, description, transcript, duration_seconds, order_index) VALUES
('m0000000-0000-0000-0000-000000000002', 'Setting up WhatsApp Business', 'A step-by-step guide.', 'First, download the app...', 480, 1),
('m0000000-0000-0000-0000-000000000002', 'Using WhatsApp Catalogs', 'Showcase your products directly in chat.', 'Open business settings...', 600, 2),
('m0000000-0000-0000-0000-000000000002', 'Broadcast Lists & Groups', 'How to reach customers effectively.', 'A broadcast list lets you...', 450, 3);

-- Lessons (Module 3)
INSERT INTO lessons (module_id, title, description, transcript, duration_seconds, order_index) VALUES
('m0000000-0000-0000-0000-000000000003', 'Closing Sales Online', 'Techniques for converting chats to sales.', 'When a customer asks...', 520, 1),
('m0000000-0000-0000-0000-000000000003', 'Handling Customer Complaints', 'De-escalation and resolution.', 'Stay calm and listen...', 400, 2),
('m0000000-0000-0000-0000-000000000003', 'Getting Reviews and Referrals', 'Growing through word of mouth.', 'After a successful sale...', 350, 3);

-- =============================================
-- 4. Inclusive Employers & Jobs
-- =============================================

INSERT INTO employers (id, company_name, is_inclusive_certified, website) VALUES
('e0000000-0000-0000-0000-000000000001', 'Tech4All Nigeria', true, 'https://example.com'),
('e0000000-0000-0000-0000-000000000002', 'Inclusive Finance Ltd', true, 'https://example.com');

INSERT INTO job_listings (employer_id, title, description, skills_required, is_micro_internship, stipend_ngn, status) VALUES
('e0000000-0000-0000-0000-000000000001', 'Social Media Assistant', 'Manage our social media presence.', ARRAY['Digital Marketing', 'Content Creation'], false, 50000, 'open'),
('e0000000-0000-0000-0000-000000000001', 'Customer Support Trainee', 'Remote support role. Screen reader compatible tools provided.', ARRAY['Customer Service'], true, 25000, 'open'),
('e0000000-0000-0000-0000-000000000002', 'Data Entry Clerk', 'Flexible hours, remote work.', ARRAY['Data Entry', 'Excel'], false, 40000, 'open');

-- =============================================
-- 5. API Partners
-- =============================================

INSERT INTO api_partners (organisation_name, contact_email, tier, features_enabled, api_key) VALUES
('Demo EdTech Partner', 'partner@example.com', 'free', '{"nsl": true, "ui_skin": true, "screen_reader": true}', 'demo-partner-key-12345');

-- =============================================
-- 6. Safety Reports
-- =============================================

INSERT INTO safety_reports (reporter_id, reported_user_id, description, severity, status) VALUES
('L0000000-0000-0000-0000-000000000001', 'L0000000-0000-0000-0000-000000000002', 'User is sending inappropriate messages in a group chat context.', 'medium', 'submitted'),
('L0000000-0000-0000-0000-000000000003', NULL, 'The video player accessibility controls are causing my screen reader to crash.', 'high', 'under_review');
