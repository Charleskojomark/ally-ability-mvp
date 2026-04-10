import { sqliteTable, text, integer, numeric, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper for timestamps
const timestamp = (name: string) => integer(name, { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`);

// USERS
export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // We will use crypto.randomUUID() on insertion
    email: text('email').unique().notNull(),
    password_hash: text('password_hash').notNull(), // New for Custom Auth
    full_name: text('full_name').notNull(),
    phone: text('phone'),
    role: text('role', { enum: ['learner', 'teacher', 'champion', 'moderator', 'admin', 'partner'] }).default('learner').notNull(),
    disability_type: text('disability_type', { enum: ['visual', 'hearing', 'cognitive', 'physical', 'none', 'prefer_not_to_say'] }).default('none'),
    state: text('state'),
    lga: text('lga'),
    preferred_language: text('preferred_language').default('en'),
    accessibility_prefs: text('accessibility_prefs', { mode: 'json' }).default('{}'), // JSON stored as string
    avatar_url: text('avatar_url'),
    is_active: integer('is_active', { mode: 'boolean' }).default(true),
    created_at: timestamp('created_at'),
    updated_at: timestamp('updated_at')
});

// COURSES
export const courses = sqliteTable('courses', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    thumbnail_url: text('thumbnail_url'),
    category: text('category'),
    accessibility_level: text('accessibility_level', { enum: ['basic', 'standard', 'gold'] }).default('basic'),
    has_nsl: integer('has_nsl', { mode: 'boolean' }).default(false),
    has_audio_description: integer('has_audio_description', { mode: 'boolean' }).default(false),
    has_captions: integer('has_captions', { mode: 'boolean' }).default(false),
    is_offline_ready: integer('is_offline_ready', { mode: 'boolean' }).default(false),
    status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft'),
    created_by: text('created_by').references(() => users.id),
    created_at: timestamp('created_at'),
    updated_at: timestamp('updated_at')
});

// MODULES
export const modules = sqliteTable('modules', {
    id: text('id').primaryKey(),
    course_id: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    order_index: integer('order_index').notNull(),
    created_at: timestamp('created_at')
});

// LESSONS
export const lessons = sqliteTable('lessons', {
    id: text('id').primaryKey(),
    module_id: text('module_id').references(() => modules.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    video_url: text('video_url'),
    nsl_video_url: text('nsl_video_url'),
    transcript: text('transcript'),
    vtt_captions_url: text('vtt_captions_url'),
    duration_seconds: integer('duration_seconds'),
    order_index: integer('order_index').notNull(),
    file_size_bytes: integer('file_size_bytes'),
    created_at: timestamp('created_at')
});

// ENROLMENTS
export const enrolments = sqliteTable('enrolments', {
    id: text('id').primaryKey(),
    user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    course_id: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    enrolled_at: timestamp('enrolled_at'),
    completed_at: timestamp('completed_at'),
    completion_percentage: integer('completion_percentage').default(0),
});

// LESSON PROGRESS
export const lessonProgress = sqliteTable('lesson_progress', {
    id: text('id').primaryKey(),
    user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    lesson_id: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
    watched_seconds: integer('watched_seconds').default(0),
    completed: integer('completed', { mode: 'boolean' }).default(false),
    accessibility_features_used: text('accessibility_features_used', { mode: 'json' }).default('{}'),
    completed_at: timestamp('completed_at'),
}, (t) => ({
    unq: unique().on(t.user_id, t.lesson_id)
}));

// CHAMPION PROFILES
export const championProfiles = sqliteTable('champion_profiles', {
    id: text('id').primaryKey(),
    user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique(),
    bio: text('bio'),
    specialisations: text('specialisations', { mode: 'json' }).default('[]'), // Array to JSON string
    languages: text('languages', { mode: 'json' }).default('[]'), // Array to JSON string
    is_available: integer('is_available', { mode: 'boolean' }).default(true),
    rating: numeric('rating').default('0'),
    total_sessions: integer('total_sessions').default(0),
    compensation_per_session_ngn: integer('compensation_per_session_ngn'),
    created_at: timestamp('created_at'),
});

// MENTORSHIP SESSIONS
export const mentorshipSessions = sqliteTable('mentorship_sessions', {
    id: text('id').primaryKey(),
    champion_id: text('champion_id').references(() => users.id),
    teacher_id: text('teacher_id').references(() => users.id),
    scheduled_at: timestamp('scheduled_at').notNull(),
    duration_minutes: integer('duration_minutes').default(30),
    channel: text('channel', { enum: ['in_app', 'whatsapp', 'telegram'] }).default('in_app'),
    status: text('status', { enum: ['pending', 'confirmed', 'completed', 'cancelled'] }).default('pending'),
    jitsi_room_name: text('jitsi_room_name'),
    notes: text('notes'),
    teacher_rating: integer('teacher_rating'),
    teacher_feedback: text('teacher_feedback'),
    amount_ngn: integer('amount_ngn'),
    created_at: timestamp('created_at'),
});

// SAFETY REPORTS
export const safetyReports = sqliteTable('safety_reports', {
    id: text('id').primaryKey(),
    reporter_id: text('reporter_id').references(() => users.id),
    reported_user_id: text('reported_user_id').references(() => users.id),
    description: text('description').notNull(),
    evidence_urls: text('evidence_urls', { mode: 'json' }).default('[]'), // Array to JSON string
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium'),
    status: text('status', { enum: ['submitted', 'under_review', 'resolved', 'escalated'] }).default('submitted'),
    assigned_moderator_id: text('assigned_moderator_id').references(() => users.id),
    moderator_notes: text('moderator_notes'),
    acknowledged_at: timestamp('acknowledged_at'),
    resolved_at: timestamp('resolved_at'),
    created_at: timestamp('created_at'),
});

// EMPLOYERS
export const employers = sqliteTable('employers', {
    id: text('id').primaryKey(),
    company_name: text('company_name').notNull(),
    website: text('website'),
    is_inclusive_certified: integer('is_inclusive_certified', { mode: 'boolean' }).default(false),
    certified_at: timestamp('certified_at'),
    contact_email: text('contact_email'),
    created_at: timestamp('created_at'),
});

// JOB LISTINGS
export const jobListings = sqliteTable('job_listings', {
    id: text('id').primaryKey(),
    employer_id: text('employer_id').references(() => employers.id),
    title: text('title').notNull(),
    description: text('description'),
    skills_required: text('skills_required', { mode: 'json' }).default('[]'), // Array to JSON string
    is_micro_internship: integer('is_micro_internship', { mode: 'boolean' }).default(false),
    duration_weeks: integer('duration_weeks'),
    stipend_ngn: integer('stipend_ngn'),
    status: text('status', { enum: ['open', 'closed', 'filled'] }).default('open'),
    apply_url: text('apply_url'),
    created_at: timestamp('created_at'),
    expires_at: timestamp('expires_at'),
});

// API PARTNERS
export const apiPartners = sqliteTable('api_partners', {
    id: text('id').primaryKey(),
    organisation_name: text('organisation_name').notNull(),
    contact_email: text('contact_email').notNull(),
    api_key: text('api_key').unique().notNull(),
    tier: text('tier', { enum: ['free', 'starter', 'growth', 'enterprise'] }).default('free'),
    features_enabled: text('features_enabled', { mode: 'json' }).default('{"nsl":true,"ui_skin":true,"screen_reader":true}'),
    is_active: integer('is_active', { mode: 'boolean' }).default(true),
    created_at: timestamp('created_at'),
});

// WIDGET EVENTS
export const widgetEvents = sqliteTable('widget_events', {
    id: text('id').primaryKey(),
    partner_id: text('partner_id').references(() => apiPartners.id),
    event_type: text('event_type').notNull(),
    session_id: text('session_id'),
    recorded_at: timestamp('recorded_at'),
});

// CERTIFICATES
export const certificates = sqliteTable('certificates', {
    id: text('id').primaryKey(),
    user_id: text('user_id').references(() => users.id),
    type: text('type').notNull(),
    issued_at: timestamp('issued_at'),
    badge_url: text('badge_url'),
    verification_code: text('verification_code').unique(),
});
