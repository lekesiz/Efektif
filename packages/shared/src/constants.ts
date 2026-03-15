// ─── Application Constants ───────────────────────────────
// Single source of truth for all magic numbers and limits

export const APP_NAME = "Efektif";
export const APP_DOMAIN = "efektif.net";

// ─── Auth ────────────────────────────────────────────────
export const SESSION_MAX_AGE_DAYS = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
export const MAX_LOGIN_ATTEMPTS_PER_15MIN = 5;

// ─── Tests ───────────────────────────────────────────────
export const TEST_TYPES = ["riasec", "bigfive", "values"] as const;
export type TestType = (typeof TEST_TYPES)[number];

export const RIASEC_QUESTION_COUNT = 30;
export const BIGFIVE_QUESTION_COUNT = 50;
export const VALUES_QUESTION_COUNT = 30;
export const RIASEC_DIMENSIONS = ["R", "I", "A", "S", "E", "C"] as const;
export const BIGFIVE_DIMENSIONS = ["O", "C", "E", "A", "N"] as const;
export const VALUES_DIMENSIONS = [
  "achievement",
  "independence",
  "recognition",
  "relationships",
  "support",
  "working_conditions",
] as const;

// ─── Debrief ─────────────────────────────────────────────
export const MAX_DEBRIEF_MESSAGES = 7;
export const DEBRIEF_AUTO_COMPLETE_AT = 7;

// ─── Careers ─────────────────────────────────────────────
export const MAX_FAVORITES = 50;
export const MAX_PRIORITIES = 10;
export const SMART_MATCH_LIMIT = 30;
export const CAREER_AI_RERANK_CANDIDATES = 45;

// ─── Admission ───────────────────────────────────────────
export const MAX_DOSSIERS_PER_STUDENT = 4;
export const MAX_DOCUMENTS_PER_DOSSIER = 5;

// ─── Upload ──────────────────────────────────────────────
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

// ─── Notifications ───────────────────────────────────────
export const NOTIFICATION_POLL_INTERVAL_MS = 30_000;
export const MESSAGE_POLL_INTERVAL_MS = 5_000;

// ─── Rate Limiting ───────────────────────────────────────
export const RATE_LIMIT_AUTH = { requests: 5, windowMs: 15 * 60 * 1000 };
export const RATE_LIMIT_AI = { requests: 10, windowMs: 60 * 1000 };
export const RATE_LIMIT_UPLOAD = { requests: 20, windowMs: 60 * 1000 };

// ─── AI ──────────────────────────────────────────────────
export const AI_MODEL_FAST = "claude-haiku-4-5-20251001";
export const AI_MODEL_REASONING = "claude-sonnet-4-6";
export const AI_MAX_TOKENS = 8192;
export const DOCUMENT_CONTENT_MAX_CHARS = 4000;
export const DEBRIEF_CONTEXT_MAX_CHARS = 6000;

// ─── Locales ─────────────────────────────────────────────
export const LOCALES = ["fr", "tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

// ─── Access Levels ───────────────────────────────────────
export const ACCESS_LEVELS = ["free", "standard", "premium"] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];
export const PAID_ACCESS_LEVELS: AccessLevel[] = ["standard", "premium"];

// ─── Roles ───────────────────────────────────────────────
export const USER_ROLES = ["student", "counselor", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const PRIVILEGED_ROLES: UserRole[] = ["counselor", "admin"];

// ─── Stripe ──────────────────────────────────────────────
export const STRIPE_PLANS = {
  standard: { name: "Standard", price: 9900, currency: "eur" },
  premium: { name: "Premium", price: 19900, currency: "eur" },
} as const;

// ─── Journey Stages ──────────────────────────────────────
export const JOURNEY_STAGES = [
  "profile",
  "documents",
  "tests",
  "debrief",
  "careers",
  "analysis",
  "admission",
] as const;
export type JourneyStage = (typeof JOURNEY_STAGES)[number];
