// ─── Caméléon Profile System ─────────────────────────────
// Age-based tone and vocabulary adaptation for AI responses

import type { Locale } from "@efektif/shared";

export type CameleonProfile = "collegien" | "lyceen" | "superieur" | "adulte";

interface ToneConfig {
  description: Record<Locale, string>;
  vocabularyLevel: string;
  exampleStyle: string;
  addressStyle: Record<Locale, string>;
}

const TONE_CONFIGS: Record<CameleonProfile, ToneConfig> = {
  collegien: {
    description: {
      fr: "Ton chaleureux et encourageant, vocabulaire simple, exemples concrets du quotidien",
      tr: "Sıcak ve cesaretlendirici ton, basit kelimeler, günlük yaşamdan örnekler",
      en: "Warm and encouraging tone, simple vocabulary, everyday examples",
    },
    vocabularyLevel: "simple",
    exampleStyle: "everyday_life",
    addressStyle: {
      fr: "Tu peux utiliser le tutoiement",
      tr: "Samimi bir dil kullan",
      en: "Use friendly, informal language",
    },
  },
  lyceen: {
    description: {
      fr: "Ton respectueux mais accessible, vocabulaire enrichi, exemples du monde professionnel",
      tr: "Saygılı ama erişilebilir ton, zengin kelime dağarcığı, profesyonel dünyadan örnekler",
      en: "Respectful but accessible tone, richer vocabulary, professional world examples",
    },
    vocabularyLevel: "intermediate",
    exampleStyle: "professional_world",
    addressStyle: {
      fr: "Vouvoiement respectueux",
      tr: "Saygılı bir dil kullan",
      en: "Use respectful, semi-formal language",
    },
  },
  superieur: {
    description: {
      fr: "Ton professionnel, terminologie technique, références au marché du travail",
      tr: "Profesyonel ton, teknik terminoloji, iş piyasasına referanslar",
      en: "Professional tone, technical terminology, job market references",
    },
    vocabularyLevel: "advanced",
    exampleStyle: "job_market",
    addressStyle: {
      fr: "Vouvoiement professionnel",
      tr: "Profesyonel bir dil kullan",
      en: "Use professional language",
    },
  },
  adulte: {
    description: {
      fr: "Ton empathique et professionnel, reconnaissance de l'expérience, focus sur la transition",
      tr: "Empatik ve profesyonel ton, deneyimin tanınması, geçiş odaklı",
      en: "Empathetic and professional tone, experience recognition, transition-focused",
    },
    vocabularyLevel: "professional",
    exampleStyle: "career_transition",
    addressStyle: {
      fr: "Vouvoiement avec empathie",
      tr: "Saygılı ve anlayışlı bir dil kullan",
      en: "Use empathetic, professional language",
    },
  },
};

export function getCameleonConfig(profile: CameleonProfile, locale: Locale): string {
  const config = TONE_CONFIGS[profile];
  return [
    `<tone_adaptation>`,
    `Profile: ${profile}`,
    `Tone: ${config.description[locale]}`,
    `Vocabulary: ${config.vocabularyLevel}`,
    `Examples: ${config.exampleStyle}`,
    `Address: ${config.addressStyle[locale]}`,
    `</tone_adaptation>`,
  ].join("\n");
}

/**
 * Determine student profile from birth date or school level.
 */
export function determineProfile(
  birthDate?: Date | null,
  schoolLevel?: string | null,
): CameleonProfile {
  if (schoolLevel) {
    if (schoolLevel.startsWith("college_")) return "collegien";
    if (schoolLevel.startsWith("lycee_")) return "lyceen";
    if (schoolLevel.startsWith("bac_plus_")) return "superieur";
    if (["working", "seeking", "retraining"].includes(schoolLevel)) return "adulte";
  }

  if (birthDate) {
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 16) return "collegien";
    if (age < 18) return "lyceen";
    if (age < 25) return "superieur";
    return "adulte";
  }

  return "lyceen"; // Default
}
