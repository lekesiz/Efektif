// ─── Psychometric Dimension Metadata ─────────────────────
// Single source of truth for test dimensions, labels, colors

import type { Locale } from "./constants";

// ─── RIASEC ──────────────────────────────────────────────
export const RIASEC_META = {
  R: {
    labels: { fr: "Réaliste", tr: "Gerçekçi", en: "Realistic" },
    color: "#e74c3c",
    colorOklch: "oklch(0.63 0.24 25)",
  },
  I: {
    labels: { fr: "Investigateur", tr: "Araştırmacı", en: "Investigative" },
    color: "#3498db",
    colorOklch: "oklch(0.62 0.17 250)",
  },
  A: {
    labels: { fr: "Artistique", tr: "Sanatsal", en: "Artistic" },
    color: "#9b59b6",
    colorOklch: "oklch(0.56 0.2 300)",
  },
  S: {
    labels: { fr: "Social", tr: "Sosyal", en: "Social" },
    color: "#2ecc71",
    colorOklch: "oklch(0.72 0.19 155)",
  },
  E: {
    labels: { fr: "Entreprenant", tr: "Girişimci", en: "Enterprising" },
    color: "#f39c12",
    colorOklch: "oklch(0.75 0.16 70)",
  },
  C: {
    labels: { fr: "Conventionnel", tr: "Geleneksel", en: "Conventional" },
    color: "#1abc9c",
    colorOklch: "oklch(0.7 0.14 185)",
  },
} as const;

// ─── Big Five ────────────────────────────────────────────
export const BIGFIVE_META = {
  O: {
    labels: { fr: "Ouverture", tr: "Deneyime Açıklık", en: "Openness" },
    color: "#8e44ad",
  },
  C: {
    labels: { fr: "Conscienciosité", tr: "Sorumluluk", en: "Conscientiousness" },
    color: "#27ae60",
  },
  E: {
    labels: { fr: "Extraversion", tr: "Dışadönüklük", en: "Extraversion" },
    color: "#f39c12",
  },
  A: {
    labels: { fr: "Agréabilité", tr: "Uyumluluk", en: "Agreeableness" },
    color: "#3498db",
  },
  N: {
    labels: { fr: "Stabilité émotionnelle", tr: "Duygusal Denge", en: "Emotional Stability" },
    color: "#e74c3c",
  },
} as const;

// ─── Values ──────────────────────────────────────────────
export const VALUES_META = {
  achievement: {
    labels: { fr: "Réussite", tr: "Başarı", en: "Achievement" },
    color: "#e67e22",
  },
  independence: {
    labels: { fr: "Indépendance", tr: "Bağımsızlık", en: "Independence" },
    color: "#2ecc71",
  },
  recognition: {
    labels: { fr: "Reconnaissance", tr: "Tanınma", en: "Recognition" },
    color: "#9b59b6",
  },
  relationships: {
    labels: { fr: "Relations", tr: "İlişkiler", en: "Relationships" },
    color: "#3498db",
  },
  support: {
    labels: { fr: "Soutien", tr: "Destek", en: "Support" },
    color: "#1abc9c",
  },
  working_conditions: {
    labels: { fr: "Conditions de travail", tr: "Çalışma Koşulları", en: "Working Conditions" },
    color: "#34495e",
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────
export function getDimensionLabel(
  meta: Record<string, { labels: Record<string, string> }>,
  key: string,
  locale: Locale,
): string {
  return meta[key]?.labels[locale] ?? key;
}

export function getDimensionColor(
  meta: Record<string, { color: string }>,
  key: string,
): string {
  return meta[key]?.color ?? "#95a5a6";
}
