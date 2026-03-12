// =============================================
// Database Model Types — The Ally-Ability Network
// =============================================
// These types mirror the database schema exactly.

// --- Enums ---

export type UserRole = 'learner' | 'teacher' | 'champion' | 'moderator' | 'admin' | 'partner';
export type DisabilityType = 'visual' | 'hearing' | 'cognitive' | 'physical' | 'none' | 'prefer_not_to_say';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type AccessibilityLevel = 'basic' | 'standard' | 'gold';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type SessionChannel = 'in_app' | 'whatsapp' | 'telegram';
export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'escalated';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type JobStatus = 'open' | 'closed' | 'filled';
export type PartnerTier = 'free' | 'starter' | 'growth' | 'enterprise';

// --- Accessibility Preferences ---

export interface AccessibilityPrefs {
    dyslexia_font?: boolean;
    high_contrast?: boolean;
    text_size?: 'standard' | 'large' | 'xl';
}

// --- Models ---

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: UserRole;
    disability_type: DisabilityType;
    state?: string;
    lga?: string;
    preferred_language: string;
    accessibility_prefs: AccessibilityPrefs;
    avatar_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    category?: string;
    accessibility_level: AccessibilityLevel;
    has_nsl: boolean;
    has_audio_description: boolean;
    has_captions: boolean;
    is_offline_ready: boolean;
    status: ContentStatus;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    order_index: number;
    created_at: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description?: string;
    video_url?: string;
    nsl_video_url?: string;
    transcript?: string;
    vtt_captions_url?: string;
    duration_seconds?: number;
    order_index: number;
    file_size_bytes?: number;
    created_at: string;
}

export interface Enrolment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    completed_at?: string;
    completion_percentage: number;
}

export interface LessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    watched_seconds: number;
    completed: boolean;
    accessibility_features_used: Record<string, boolean>;
    completed_at?: string;
}

export interface ChampionProfile {
    id: string;
    user_id: string;
    bio?: string;
    specialisations: string[];
    languages: string[];
    is_available: boolean;
    rating: number;
    total_sessions: number;
    compensation_per_session_ngn?: number;
    created_at: string;
}

export interface MentorshipSession {
    id: string;
    champion_id: string;
    teacher_id: string;
    scheduled_at: string;
    duration_minutes: number;
    channel: SessionChannel;
    status: SessionStatus;
    jitsi_room_name?: string;
    notes?: string;
    teacher_rating?: number;
    teacher_feedback?: string;
    amount_ngn?: number;
    created_at: string;
}

export interface SafetyReport {
    id: string;
    reporter_id: string;
    reported_user_id?: string;
    description: string;
    evidence_urls: string[];
    severity: ReportSeverity;
    status: ReportStatus;
    assigned_moderator_id?: string;
    moderator_notes?: string;
    acknowledged_at?: string;
    resolved_at?: string;
    created_at: string;
}

export interface Employer {
    id: string;
    company_name: string;
    website?: string;
    is_inclusive_certified: boolean;
    certified_at?: string;
    contact_email?: string;
    created_at: string;
}

export interface JobListing {
    id: string;
    employer_id: string;
    title: string;
    description?: string;
    skills_required: string[];
    is_micro_internship: boolean;
    duration_weeks?: number;
    stipend_ngn?: number;
    status: JobStatus;
    apply_url?: string;
    created_at: string;
    expires_at?: string;
}

export interface Certificate {
    id: string;
    user_id: string;
    type: string;
    issued_at: string;
    badge_url?: string;
    verification_code: string;
}

export interface ApiPartner {
    id: string;
    organisation_name: string;
    contact_email: string;
    api_key: string;
    tier: PartnerTier;
    features_enabled: {
        nsl: boolean;
        ui_skin: boolean;
        screen_reader: boolean;
    };
    is_active: boolean;
    created_at: string;
}

export interface WidgetEvent {
    id: string;
    partner_id: string;
    event_type: string;
    session_id?: string;
    recorded_at: string;
}
