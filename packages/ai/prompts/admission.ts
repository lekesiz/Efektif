// ─── Admission Advice Prompt Builder ─────────────────────
// Builds prompts for generating admission guidance and application materials

import type { Locale, TestScores } from "@efektif/shared";
import { RIASEC_META, BIGFIVE_META, VALUES_META, getDimensionLabel } from "@efektif/shared/psychometric";
import { sanitizeName, wrapUserContent } from "../sanitize";

interface StudentProfile {
  name: string;
  schoolLevel: string | null;
  city: string | null;
  country: string | null;
}

interface TestResultInput {
  testType: string;
  scores: TestScores;
}

const INSTRUCTIONS: Record<Locale, string> = {
  fr: `Tu es un expert en admission et orientation scolaire en France.
Génère des conseils d'admission complets au format JSON strict suivant:
{
  "overview": "Synthèse du profil et de l'adéquation avec la formation",
  "strengths": ["Force 1", "Force 2", ...],
  "areasToHighlight": ["Point à mettre en avant 1", ...],
  "motivationLetter": "Brouillon complet de lettre de motivation (300-400 mots)",
  "cvTips": ["Conseil CV 1", "Conseil CV 2", ...],
  "timeline": [{"month": "Janvier", "action": "Action à faire"}, ...],
  "schoolSuggestions": ["École/formation 1", "École/formation 2", ...],
  "interviewTips": ["Conseil entretien 1", ...]
}
Réponds UNIQUEMENT avec le JSON, sans markdown ni commentaires.`,
  tr: `Sen Fransa'da kabul ve akademik yönlendirme uzmanısın.
Aşağıdaki kesin JSON formatında kapsamlı kabul tavsiyeleri oluştur:
{
  "overview": "Profil özeti ve programa uygunluk",
  "strengths": ["Güçlü yön 1", "Güçlü yön 2", ...],
  "areasToHighlight": ["Öne çıkarılacak nokta 1", ...],
  "motivationLetter": "Tam motivasyon mektubu taslağı (300-400 kelime)",
  "cvTips": ["CV tavsiyesi 1", "CV tavsiyesi 2", ...],
  "timeline": [{"month": "Ocak", "action": "Yapılacak eylem"}, ...],
  "schoolSuggestions": ["Okul/program 1", "Okul/program 2", ...],
  "interviewTips": ["Mülakat tavsiyesi 1", ...]
}
YALNIZCA JSON ile yanıt ver, markdown veya yorum ekleme.`,
  en: `You are an expert in admissions and academic guidance in France.
Generate comprehensive admission advice in the following strict JSON format:
{
  "overview": "Profile summary and program fit assessment",
  "strengths": ["Strength 1", "Strength 2", ...],
  "areasToHighlight": ["Point to highlight 1", ...],
  "motivationLetter": "Complete motivation letter draft (300-400 words)",
  "cvTips": ["CV tip 1", "CV tip 2", ...],
  "timeline": [{"month": "January", "action": "Action to take"}, ...],
  "schoolSuggestions": ["School/program 1", "School/program 2", ...],
  "interviewTips": ["Interview tip 1", ...]
}
Respond ONLY with the JSON, no markdown or comments.`,
};

function formatTestScores(results: TestResultInput[], locale: Locale): string {
  return results
    .map((r) => {
      const meta = r.testType === "riasec" ? RIASEC_META : r.testType === "bigfive" ? BIGFIVE_META : VALUES_META;
      const scores = Object.entries(r.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([dim, score]) => `  ${getDimensionLabel(meta, dim, locale)}: ${score}`)
        .join("\n");
      return `${r.testType.toUpperCase()}:\n${scores}`;
    })
    .join("\n\n");
}

export function buildAdmissionPrompt(
  career: string,
  studentProfile: StudentProfile,
  testResults: TestResultInput[],
  locale: Locale,
): string {
  const safeName = sanitizeName(studentProfile.name);
  const safeCareer = career.slice(0, 200).trim();
  const testsBlock = formatTestScores(testResults, locale);

  return [
    INSTRUCTIONS[locale],
    "",
    `<context>`,
    wrapUserContent(safeName, "student_name"),
    `<target_career>${safeCareer}</target_career>`,
    `<school_level>${studentProfile.schoolLevel ?? "unknown"}</school_level>`,
    `<location>${studentProfile.city ?? ""}, ${studentProfile.country ?? "France"}</location>`,
    `<psychometric_profile>`,
    testsBlock,
    `</psychometric_profile>`,
    `</context>`,
  ].join("\n");
}
