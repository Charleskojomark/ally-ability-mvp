// =============================================
// Shared Constants — The Ally-Ability Network
// =============================================

export const USER_ROLES = ['learner', 'teacher', 'champion', 'moderator', 'admin', 'partner'] as const;

export const DISABILITY_TYPES = ['visual', 'hearing', 'cognitive', 'physical', 'none', 'prefer_not_to_say'] as const;

export const ACCESSIBILITY_LEVELS = ['basic', 'standard', 'gold'] as const;

export const SESSION_CHANNELS = ['in_app', 'whatsapp', 'telegram'] as const;

export const REPORT_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

export const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'pcm', label: 'Nigerian Pidgin' },
] as const;

export const MAX_LESSON_DURATION_SECONDS = 900; // 15 minutes
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB after compression
export const JITSI_SERVER_URL = 'https://meet.jit.si';

export const ALLY_SYSTEM_PROMPT = `You are Ally, a friendly learning assistant for the Ally-Ability Network — a Nigerian platform helping women, persons with disabilities, and teachers access digital skills.

Help learners understand course content, answer questions about digital skills and vocations, and guide them through the platform. Be warm, encouraging, and practical. When the user writes in Nigerian Pidgin, respond in Pidgin. When they write in English, respond in English. Keep responses under 3 short paragraphs.

Never give medical, legal, or financial advice. If a user reports feeling unsafe or being harassed, immediately direct them to click the Safe Space button on the platform.`;
