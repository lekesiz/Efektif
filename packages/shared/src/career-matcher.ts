// ─── Career Matching Engine ──────────────────────────────────
// Matches student psychometric profiles to career profiles

import type { CareerMatch, CareerSummary, TestScores } from "./types";

// ─── Types ──────────────────────────────────────────────────

export interface StudentProfile {
  riasec: TestScores;
  bigfive?: TestScores;
  values?: TestScores;
}

export interface CareerProfile {
  career: CareerSummary;
  riasec: TestScores;
  bigfive?: TestScores;
  values?: TestScores;
}

export interface MatchOptions {
  limit?: number;
  minScore?: number;
  includeBigfive?: boolean;
  includeValues?: boolean;
}

// ─── RIASEC Match (Euclidean distance → 0-100) ─────────────

const RIASEC_KEYS = ["R", "I", "A", "S", "E", "C"] as const;

/**
 * Calculate RIASEC match score using normalized Euclidean distance.
 * Both inputs should have scores 0-100 for each dimension.
 * Returns 0-100 where 100 = perfect match.
 */
export function calculateMatchScore(
  studentRiasec: TestScores,
  careerRiasec: TestScores,
): number {
  let sumSquared = 0;
  for (const key of RIASEC_KEYS) {
    const diff = (studentRiasec[key] ?? 0) - (careerRiasec[key] ?? 0);
    sumSquared += diff * diff;
  }

  // Max possible distance: sqrt(6 * 100^2) = ~244.9
  const maxDistance = Math.sqrt(RIASEC_KEYS.length * 100 * 100);
  const distance = Math.sqrt(sumSquared);
  const normalized = Math.max(0, 1 - distance / maxDistance);

  return Math.round(normalized * 100);
}

// ─── Big Five Bonus (0-20) ──────────────────────────────────

const BIGFIVE_KEYS = ["O", "C", "E", "A", "N"] as const;

/**
 * Calculate Big Five compatibility bonus.
 * Returns 0-20 bonus points based on profile similarity.
 */
export function calculateBigfiveBonus(
  studentBigfive: TestScores,
  careerBigfive: TestScores,
): number {
  let sumSquared = 0;
  let count = 0;

  for (const key of BIGFIVE_KEYS) {
    const s = studentBigfive[key];
    const c = careerBigfive[key];
    if (s != null && c != null) {
      sumSquared += (s - c) * (s - c);
      count++;
    }
  }

  if (count === 0) return 0;

  const maxDistance = Math.sqrt(count * 100 * 100);
  const distance = Math.sqrt(sumSquared);
  const normalized = Math.max(0, 1 - distance / maxDistance);

  return Math.round(normalized * 20);
}

// ─── Values Bonus (0-10) ───────────────────────────────────

const VALUES_KEYS = [
  "achievement",
  "independence",
  "recognition",
  "relationships",
  "support",
  "working_conditions",
] as const;

/**
 * Calculate work values compatibility bonus.
 * Returns 0-10 bonus points based on values alignment.
 */
export function calculateValuesBonus(
  studentValues: TestScores,
  careerValues: TestScores,
): number {
  let sumSquared = 0;
  let count = 0;

  for (const key of VALUES_KEYS) {
    const s = studentValues[key];
    const c = careerValues[key];
    if (s != null && c != null) {
      sumSquared += (s - c) * (s - c);
      count++;
    }
  }

  if (count === 0) return 0;

  const maxDistance = Math.sqrt(count * 100 * 100);
  const distance = Math.sqrt(sumSquared);
  const normalized = Math.max(0, 1 - distance / maxDistance);

  return Math.round(normalized * 10);
}

// ─── Top Match Reasons ─────────────────────────────────────

function getTopReasons(
  student: StudentProfile,
  career: CareerProfile,
): string[] {
  const reasons: { text: string; score: number }[] = [];

  // Find strongest RIASEC overlaps
  for (const key of RIASEC_KEYS) {
    const s = student.riasec[key] ?? 0;
    const c = career.riasec[key] ?? 0;
    if (s >= 60 && c >= 60) {
      const overlap = Math.min(s, c);
      reasons.push({ text: `strong_${key.toLowerCase()}`, score: overlap });
    }
  }

  // Big Five alignment
  if (student.bigfive && career.bigfive) {
    for (const key of BIGFIVE_KEYS) {
      const s = student.bigfive[key] ?? 0;
      const c = career.bigfive[key] ?? 0;
      if (s >= 60 && c >= 60 && Math.abs(s - c) < 20) {
        reasons.push({ text: `bigfive_${key.toLowerCase()}`, score: Math.min(s, c) });
      }
    }
  }

  // Values alignment
  if (student.values && career.values) {
    for (const key of VALUES_KEYS) {
      const s = student.values[key] ?? 0;
      const c = career.values[key] ?? 0;
      if (s >= 60 && c >= 60 && Math.abs(s - c) < 20) {
        reasons.push({ text: `values_${key}`, score: Math.min(s, c) });
      }
    }
  }

  return reasons
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.text);
}

// ─── Find Best Matches ─────────────────────────────────────

/**
 * Find and rank best career matches for a student.
 * Combines RIASEC (primary), Big Five (bonus), and Values (bonus).
 * Returns sorted array of CareerMatch objects.
 */
export function findBestMatches(
  student: StudentProfile,
  careers: CareerProfile[],
  options: MatchOptions = {},
): CareerMatch[] {
  const {
    limit = 30,
    minScore = 0,
    includeBigfive = true,
    includeValues = true,
  } = options;

  const matches: CareerMatch[] = [];

  for (const cp of careers) {
    const riasecScore = calculateMatchScore(student.riasec, cp.riasec);

    let bigfiveScore = 0;
    if (includeBigfive && student.bigfive && cp.bigfive) {
      bigfiveScore = calculateBigfiveBonus(student.bigfive, cp.bigfive);
    }

    let valuesScore = 0;
    if (includeValues && student.values && cp.values) {
      valuesScore = calculateValuesBonus(student.values, cp.values);
    }

    // Total: RIASEC (0-100) + BigFive bonus (0-20) + Values bonus (0-10) → normalize to 0-100
    const rawTotal = riasecScore + bigfiveScore + valuesScore;
    const matchScore = Math.min(Math.round((rawTotal / 130) * 100), 100);

    if (matchScore >= minScore) {
      matches.push({
        career: cp.career,
        matchScore,
        riasecScore,
        bigfiveScore,
        valuesScore,
        aiBonus: 0,
        topReasons: getTopReasons(student, cp),
      });
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches.slice(0, limit);
}
