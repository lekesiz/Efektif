// ─── Shared Types ────────────────────────────────────────
// Types used across frontend and backend

import type { Locale, TestType, AccessLevel, UserRole, JourneyStage } from "./constants";

// ─── User ────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  accessLevel: AccessLevel;
  locale: Locale;
  birthDate: Date | null;
  city: string | null;
  country: string | null;
  schoolLevel: string | null;
  profileType: string | null;
  onboardingCompletedAt: Date | null;
  choicesSubmittedAt: Date | null;
  assignedCounselorId: string | null;
}

// ─── Tests ───────────────────────────────────────────────
export interface TestScores {
  [dimension: string]: number;
}

export interface TestResult {
  id: string;
  testType: TestType;
  scores: TestScores;
  interpretation: string | null;
  version: number;
  completedAt: Date;
}

export interface TestDraft {
  testType: TestType;
  answers: Record<string, number>;
  currentIndex: number;
  updatedAt: Date;
}

// ─── Careers ─────────────────────────────────────────────
export interface CareerMatch {
  career: CareerSummary;
  matchScore: number;
  riasecScore: number;
  bigfiveScore: number;
  valuesScore: number;
  aiBonus: number;
  topReasons: string[];
}

export interface CareerSummary {
  id: string;
  code: string;
  nameFr: string;
  nameTr: string | null;
  nameEn: string | null;
  category: string | null;
  educationLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  aiImpactScore: number | null;
}

// ─── AI ──────────────────────────────────────────────────
export interface DebriefInsight {
  testType: TestType;
  summary: string;
  keyThemes: string[];
  revealedStrengths: string[];
  careerInsights: string[];
  nuances: string[];
  isCompleted: boolean;
  exchangeCount: number;
}

export interface DiagnosticContext {
  studentName: string;
  locale: Locale;
  profileType: string;
  testResults: TestResult[];
  debriefInsights: DebriefInsight[];
  careerPriorities: { careerName: string; rank: number; matchScore: number | null }[];
  documentContent: string | null;
}

export interface AdmissionAdvice {
  overview: string;
  strengths: string[];
  areasToHighlight: string[];
  motivationLetter: string;
  cvTips: string[];
  timeline: { month: string; action: string }[];
  schoolSuggestions: string[];
  interviewTips: string[];
}

// ─── Journey ─────────────────────────────────────────────
export interface JourneyProgress {
  stages: Record<JourneyStage, boolean>;
  currentStage: JourneyStage;
  completedCount: number;
  totalStages: number;
  progressPercent: number;
}

// ─── Notifications ───────────────────────────────────────
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: Date;
}

// ─── Future Score ────────────────────────────────────────
export interface FutureScoreResult {
  score: number;
  label: string;
  color: string;
  components: {
    aiResilience: number;
    marketDemand: number;
    salaryAttractiveness: number;
  };
}
