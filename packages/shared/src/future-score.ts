// ─── Future Career Score Calculator ──────────────────────
// Calculates 0-100 "career of the future" score

import type { Locale } from "./constants";
import type { FutureScoreResult } from "./types";

interface CareerData {
  aiImpactScore?: number;
  demandLevel?: string;
  marketTrend?: string;
  futureOutlook?: string;
  salaryMedian?: number;
}

const DEMAND_SCORES: Record<string, number> = {
  "très forte": 100,
  forte: 75,
  moyenne: 45,
  faible: 20,
};

const TREND_SCORES: Record<string, number> = {
  shortage: 100,
  growing: 75,
  balanced: 50,
  declining: 25,
  oversupply: 10,
};

const OUTLOOK_SCORES: Record<string, number> = {
  booming: 100,
  growing: 75,
  stable: 45,
  uncertain: 25,
  declining: 10,
};

const LABELS: Record<string, Record<Locale, string>> = {
  excellent: { fr: "Excellent", tr: "Mükemmel", en: "Excellent" },
  very_good: { fr: "Très bon", tr: "Çok İyi", en: "Very Good" },
  good: { fr: "Bon", tr: "İyi", en: "Good" },
  moderate: { fr: "Modéré", tr: "Orta", en: "Moderate" },
  caution: { fr: "Prudence", tr: "Dikkat", en: "Caution" },
};

export function calculateFutureScore(career: CareerData, locale: Locale): FutureScoreResult {
  // AI Resilience (40%)
  const aiResilience = 100 - (career.aiImpactScore ?? 50);

  // Market Demand (35%)
  const demandScore = DEMAND_SCORES[career.demandLevel ?? "moyenne"] ?? 45;
  const trendScore = TREND_SCORES[career.marketTrend ?? "balanced"] ?? 50;
  const outlookScore = OUTLOOK_SCORES[career.futureOutlook ?? "stable"] ?? 45;
  const marketDemand = demandScore * 0.4 + trendScore * 0.3 + outlookScore * 0.3;

  // Salary Attractiveness (25%)
  const salaryAttractiveness = Math.min(
    Math.max(((career.salaryMedian ?? 30000) / 700) * 1, 10),
    100,
  );

  // Weighted total
  const score = Math.round(aiResilience * 0.4 + marketDemand * 0.35 + salaryAttractiveness * 0.25);
  const clamped = Math.min(Math.max(score, 0), 100);

  let labelKey: string;
  let color: string;
  if (clamped >= 80) {
    labelKey = "excellent";
    color = "oklch(0.72 0.19 155)";
  } else if (clamped >= 65) {
    labelKey = "very_good";
    color = "oklch(0.75 0.16 140)";
  } else if (clamped >= 50) {
    labelKey = "good";
    color = "oklch(0.75 0.16 70)";
  } else if (clamped >= 35) {
    labelKey = "moderate";
    color = "oklch(0.7 0.18 50)";
  } else {
    labelKey = "caution";
    color = "oklch(0.63 0.24 25)";
  }

  return {
    score: clamped,
    label: LABELS[labelKey]?.[locale] ?? labelKey,
    color,
    components: {
      aiResilience: Math.round(aiResilience),
      marketDemand: Math.round(marketDemand),
      salaryAttractiveness: Math.round(salaryAttractiveness),
    },
  };
}
