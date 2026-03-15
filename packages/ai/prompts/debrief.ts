// ─── Debrief Conversation Prompt Builder ─────────────────
// Builds system prompts for AI-guided test result debrief conversations

import type { Locale, TestType, TestScores } from "@efektif/shared";
import { MAX_DEBRIEF_MESSAGES } from "@efektif/shared";
import { RIASEC_META, BIGFIVE_META, VALUES_META, getDimensionLabel } from "@efektif/shared/psychometric";
import { getCameleonConfig, type CameleonProfile } from "./cameleon";
import { sanitizeName, wrapUserContent } from "../sanitize";

const LABELS: Record<string, Record<Locale, string>> = {
  role: {
    fr: "Tu es un conseiller d'orientation bienveillant et expérimenté.",
    tr: "Sen deneyimli ve yardımsever bir kariyer danışmanısın.",
    en: "You are a caring and experienced career counselor.",
  },
  riasecFocus: {
    fr: "Concentre-toi sur les centres d'intérêt professionnels et les environnements de travail préférés.",
    tr: "Mesleki ilgi alanlarına ve tercih edilen çalışma ortamlarına odaklan.",
    en: "Focus on professional interests and preferred work environments.",
  },
  bigfiveFocus: {
    fr: "Concentre-toi sur les traits de personnalité, les forces et les dynamiques relationnelles.",
    tr: "Kişilik özellikleri, güçlü yanlar ve ilişki dinamiklerine odaklan.",
    en: "Focus on personality traits, strengths, and relational dynamics.",
  },
  valuesFocus: {
    fr: "Concentre-toi sur les priorités de vie, les motivations profondes et ce qui compte vraiment.",
    tr: "Yaşam öncelikleri, derin motivasyonlar ve gerçekten önemli olana odaklan.",
    en: "Focus on life priorities, deep motivations, and what truly matters.",
  },
  instructions: {
    fr: `Règles:
- Analyse les résultats du test avec empathie et perspicacité
- Pose des questions ouvertes et pertinentes pour approfondir la compréhension
- Sois encourageant et bienveillant, jamais jugeant
- Relie les résultats à des situations concrètes de la vie
- Maximum {max} échanges au total, fais en sorte que chaque message compte
- Termine par un résumé des points clés et des pistes de réflexion`,
    tr: `Kurallar:
- Test sonuçlarını empati ve içgörüyle analiz et
- Anlayışı derinleştirmek için açık uçlu ve ilgili sorular sor
- Cesaretlendirici ve anlayışlı ol, asla yargılayıcı olma
- Sonuçları hayattaki somut durumlarla ilişkilendir
- Toplamda maksimum {max} mesaj değişimi, her mesajı değerli kıl
- Anahtar noktaların ve düşünce yollarının bir özetiyle bitir`,
    en: `Rules:
- Analyze test results with empathy and insight
- Ask open-ended, relevant questions to deepen understanding
- Be encouraging and supportive, never judgmental
- Connect results to concrete life situations
- Maximum {max} exchanges total, make each message count
- End with a summary of key points and reflection paths`,
  },
};

function formatScores(testType: TestType, scores: TestScores, locale: Locale): string {
  const meta = testType === "riasec" ? RIASEC_META : testType === "bigfive" ? BIGFIVE_META : VALUES_META;
  const lines = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([dim, score]) => `  ${getDimensionLabel(meta, dim, locale)}: ${score}/100`);
  return lines.join("\n");
}

function getTestFocus(testType: TestType, locale: Locale): string {
  const key = testType === "riasec" ? "riasecFocus" : testType === "bigfive" ? "bigfiveFocus" : "valuesFocus";
  return LABELS[key]![locale];
}

export function buildDebriefSystemPrompt(
  testType: TestType,
  scores: TestScores,
  studentName: string,
  profile: CameleonProfile,
  locale: Locale,
): string {
  const safeName = sanitizeName(studentName);
  const toneBlock = getCameleonConfig(profile, locale);
  const roleText = LABELS.role[locale];
  const focusText = getTestFocus(testType, locale);
  const instructions = LABELS.instructions[locale].replace("{max}", String(MAX_DEBRIEF_MESSAGES));
  const formattedScores = formatScores(testType, scores, locale);

  return [
    roleText,
    "",
    toneBlock,
    "",
    `<test_context>`,
    `Test: ${testType.toUpperCase()}`,
    wrapUserContent(safeName, "student_name"),
    `<scores>`,
    formattedScores,
    `</scores>`,
    `</test_context>`,
    "",
    focusText,
    "",
    instructions,
  ].join("\n");
}

export function buildDebriefOpeningPrompt(
  testType: TestType,
  scores: TestScores,
  locale: Locale,
): string {
  const meta = testType === "riasec" ? RIASEC_META : testType === "bigfive" ? BIGFIVE_META : VALUES_META;
  const topDimensions = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([dim]) => getDimensionLabel(meta, dim, locale));

  const prompts: Record<Locale, string> = {
    fr: `Analyse les résultats du test ${testType.toUpperCase()} de l'étudiant. Les 3 dimensions les plus fortes sont: ${topDimensions.join(", ")}. Commence par un accueil chaleureux, puis donne une première analyse des résultats en soulignant les points forts. Termine par une question ouverte pour engager la conversation.`,
    tr: `Öğrencinin ${testType.toUpperCase()} test sonuçlarını analiz et. En güçlü 3 boyut: ${topDimensions.join(", ")}. Sıcak bir karşılama ile başla, ardından güçlü yönleri vurgulayarak ilk bir analiz yap. Sohbeti başlatmak için açık uçlu bir soruyla bitir.`,
    en: `Analyze the student's ${testType.toUpperCase()} test results. The 3 strongest dimensions are: ${topDimensions.join(", ")}. Start with a warm greeting, then provide an initial analysis highlighting strengths. End with an open question to engage conversation.`,
  };

  return prompts[locale];
}
