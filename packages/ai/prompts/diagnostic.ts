// ─── Diagnostic Report Prompt Builder ────────────────────
// Builds prompts for generating comprehensive student diagnostic reports

import type { Locale, DiagnosticContext } from "@efektif/shared";
import { RIASEC_META, BIGFIVE_META, VALUES_META, getDimensionLabel } from "@efektif/shared/psychometric";
import { getCameleonConfig, determineProfile } from "./cameleon";
import { sanitizeName, wrapUserContent } from "../sanitize";

const SECTION_LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    role: "Tu es un expert en orientation professionnelle et en psychométrie.",
    format: `Génère un rapport diagnostique structuré en markdown avec ces sections:
## 1. Vue d'ensemble du profil
Un résumé concis du profil psychométrique global.

## 2. Analyse des tests
Analyse détaillée de chaque test passé (RIASEC, Big Five, Valeurs) avec interprétation croisée.

## 3. Compatibilité carrière
Évaluation des métiers prioritaires en lien avec le profil psychométrique.

## 4. Impact de l'IA
Analyse de la résilience du profil face à l'automatisation et à l'IA.

## 5. Recommandations stratégiques
Actions concrètes, formations suggérées et prochaines étapes.`,
    tone: "Le rapport doit être professionnel, constructif et orienté vers l'action.",
  },
  tr: {
    role: "Sen profesyonel yönlendirme ve psikometri uzmanısın.",
    format: `Aşağıdaki bölümlerle yapılandırılmış bir markdown diagnostik raporu oluştur:
## 1. Profil Genel Bakışı
Genel psikometrik profilin özlü bir özeti.

## 2. Test Analizi
Her tamamlanan testin (RIASEC, Big Five, Değerler) çapraz yorumlamalı detaylı analizi.

## 3. Kariyer Uyumluluğu
Psikometrik profille bağlantılı öncelikli mesleklerin değerlendirmesi.

## 4. Yapay Zeka Etkisi
Profilin otomasyon ve yapay zekaya karşı dayanıklılık analizi.

## 5. Stratejik Öneriler
Somut eylemler, önerilen eğitimler ve sonraki adımlar.`,
    tone: "Rapor profesyonel, yapıcı ve eylem odaklı olmalıdır.",
  },
  en: {
    role: "You are an expert in career guidance and psychometrics.",
    format: `Generate a structured markdown diagnostic report with these sections:
## 1. Profile Overview
A concise summary of the overall psychometric profile.

## 2. Test Analysis
Detailed analysis of each completed test (RIASEC, Big Five, Values) with cross-interpretation.

## 3. Career Compatibility
Assessment of priority careers linked to the psychometric profile.

## 4. AI Impact Assessment
Analysis of the profile's resilience to automation and AI.

## 5. Strategic Recommendations
Concrete actions, suggested training, and next steps.`,
    tone: "The report must be professional, constructive, and action-oriented.",
  },
};

function formatTestResults(ctx: DiagnosticContext, locale: Locale): string {
  return ctx.testResults
    .map((result) => {
      const meta =
        result.testType === "riasec" ? RIASEC_META : result.testType === "bigfive" ? BIGFIVE_META : VALUES_META;
      const scores = Object.entries(result.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([dim, score]) => `  ${getDimensionLabel(meta, dim, locale)}: ${score}/100`)
        .join("\n");
      return `<test type="${result.testType}">\n${scores}\n</test>`;
    })
    .join("\n\n");
}

function formatDebriefInsights(ctx: DiagnosticContext): string {
  if (!ctx.debriefInsights.length) return "";
  return ctx.debriefInsights
    .map(
      (insight) =>
        `<debrief_insight test="${insight.testType}">
Summary: ${insight.summary}
Key themes: ${insight.keyThemes.join(", ")}
Strengths: ${insight.revealedStrengths.join(", ")}
Career insights: ${insight.careerInsights.join(", ")}
</debrief_insight>`,
    )
    .join("\n\n");
}

function formatCareerPriorities(ctx: DiagnosticContext): string {
  if (!ctx.careerPriorities.length) return "";
  return ctx.careerPriorities
    .map((c) => `  ${c.rank}. ${c.careerName} (match: ${c.matchScore ?? "N/A"})`)
    .join("\n");
}

export function buildDiagnosticPrompt(ctx: DiagnosticContext, locale: Locale): string {
  const labels = SECTION_LABELS[locale];
  const profile = determineProfile(null, ctx.profileType);
  const toneBlock = getCameleonConfig(profile, locale);
  const safeName = sanitizeName(ctx.studentName);

  const parts: string[] = [
    labels.role,
    "",
    toneBlock,
    "",
    `<student_context>`,
    wrapUserContent(safeName, "name"),
    `<test_results>`,
    formatTestResults(ctx, locale),
    `</test_results>`,
  ];

  const insights = formatDebriefInsights(ctx);
  if (insights) {
    parts.push(`<debrief_insights>`, insights, `</debrief_insights>`);
  }

  const careers = formatCareerPriorities(ctx);
  if (careers) {
    parts.push(`<career_priorities>`, careers, `</career_priorities>`);
  }

  if (ctx.documentContent) {
    parts.push(wrapUserContent(ctx.documentContent, "uploaded_documents"));
  }

  parts.push(`</student_context>`, "", labels.format, "", labels.tone);

  return parts.join("\n");
}
