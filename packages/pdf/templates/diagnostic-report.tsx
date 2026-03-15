import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Locale, TestResult, DebriefInsight, CareerMatch } from "@efektif/shared";
import { BIGFIVE_META, VALUES_META, getDimensionLabel } from "@efektif/shared";
import { Header, type ReportStatus } from "../components/header";
import { Footer } from "../components/footer";
import { RiasecTable } from "../components/riasec-table";
import { ScoreBar } from "../components/score-bar";

// ─── Labels ─────────────────────────────────────────────
const L = {
  fr: { title: "Rapport Diagnostique", profile: "Profil de Tests", riasec: "Profil RIASEC", bigfive: "Personnalité (Big Five)", values: "Classement des Valeurs", debrief: "Synthèse de l'Entretien", themes: "Thèmes Clés", strengths: "Points Forts", careers: "Analyse des Métiers", matchScore: "Score de compatibilité", aiImpact: "Impact IA", automatable: "Tâches automatisables", resistant: "Tâches résistantes", recommendations: "Recommandations Stratégiques", cover: "Rapport d'Orientation Professionnelle", generated: "Généré le" },
  tr: { title: "Tanı Raporu", profile: "Test Profili", riasec: "RIASEC Profili", bigfive: "Kişilik (Big Five)", values: "Değer Sıralaması", debrief: "Görüşme Özeti", themes: "Ana Temalar", strengths: "Güçlü Yönler", careers: "Kariyer Analizi", matchScore: "Uyum Skoru", aiImpact: "Yapay Zeka Etkisi", automatable: "Otomatize edilebilir görevler", resistant: "Dirençli görevler", recommendations: "Stratejik Öneriler", cover: "Kariyer Yönlendirme Raporu", generated: "Oluşturulma tarihi" },
  en: { title: "Diagnostic Report", profile: "Test Profile Summary", riasec: "RIASEC Profile", bigfive: "Personality (Big Five)", values: "Values Ranking", debrief: "Debrief Insights", themes: "Key Themes", strengths: "Strengths", careers: "Career Analysis", matchScore: "Match Score", aiImpact: "AI Impact Assessment", automatable: "Automatable tasks", resistant: "Resistant tasks", recommendations: "Strategic Recommendations", cover: "Career Guidance Report", generated: "Generated on" },
} as const;

export interface DiagnosticReportProps {
  studentName: string;
  locale: Locale;
  status: ReportStatus;
  generationDate: string;
  testResults: TestResult[];
  debriefInsights: DebriefInsight[];
  careerMatches: CareerMatch[];
  aiImpactData?: { career: string; automatable: string[]; resistant: string[] }[];
  recommendations?: string[];
}

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 50, paddingHorizontal: 40, fontSize: 10, color: "#1e293b" },
  coverPage: { paddingTop: 40, paddingBottom: 50, paddingHorizontal: 40, justifyContent: "center", alignItems: "center" },
  coverLogo: { fontSize: 42, fontWeight: "bold", color: "#3b82f6", marginBottom: 16 },
  coverTitle: { fontSize: 22, color: "#1e293b", marginBottom: 8 },
  coverName: { fontSize: 16, color: "#64748b", marginBottom: 24 },
  coverDate: { fontSize: 11, color: "#94a3b8" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#3b82f6", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4 },
  subTitle: { fontSize: 11, fontWeight: "bold", color: "#334155", marginBottom: 4, marginTop: 8 },
  text: { fontSize: 9, color: "#475569", lineHeight: 1.5, marginBottom: 4 },
  bullet: { fontSize: 9, color: "#475569", marginLeft: 12, marginBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  dimLabel: { fontSize: 9, width: 120, color: "#1e293b" },
  barCol: { flex: 1 },
  careerCard: { marginBottom: 10, padding: 8, backgroundColor: "#f8fafc", borderRadius: 4, borderWidth: 1, borderColor: "#e2e8f0" },
  careerName: { fontSize: 11, fontWeight: "bold", color: "#1e293b", marginBottom: 4 },
  badge: { fontSize: 8, color: "#3b82f6", marginBottom: 4 },
});

function BigFiveSection({ scores, locale }: { scores: Record<string, number>; locale: Locale }) {
  return (
    <View>
      {(["O", "C", "E", "A", "N"] as const).map((dim) => (
        <View style={s.row} key={dim}>
          <Text style={s.dimLabel}>{getDimensionLabel(BIGFIVE_META, dim, locale)}</Text>
          <View style={s.barCol}>
            <ScoreBar value={scores[dim] ?? 0} color={BIGFIVE_META[dim].color} />
          </View>
        </View>
      ))}
    </View>
  );
}

function ValuesSection({ scores, locale }: { scores: Record<string, number>; locale: Locale }) {
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return (
    <View>
      {sorted.map(([key, val]) => (
        <View style={s.row} key={key}>
          <Text style={s.dimLabel}>{getDimensionLabel(VALUES_META, key, locale)}</Text>
          <View style={s.barCol}>
            <ScoreBar value={val} color={VALUES_META[key as keyof typeof VALUES_META]?.color ?? "#95a5a6"} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function DiagnosticReport(props: DiagnosticReportProps) {
  const { studentName, locale, status, generationDate, testResults, debriefInsights, careerMatches, aiImpactData, recommendations } = props;
  const l = L[locale];
  const ts = new Date().toISOString();
  const riasecResult = testResults.find((t) => t.testType === "riasec");
  const bigfiveResult = testResults.find((t) => t.testType === "bigfive");
  const valuesResult = testResults.find((t) => t.testType === "values");

  return (
    <Document title={l.title} author="Efektif">
      {/* Cover Page */}
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverLogo}>Efektif</Text>
        <Text style={s.coverTitle}>{l.cover}</Text>
        <Text style={s.coverName}>{studentName}</Text>
        <Text style={s.coverDate}>{l.generated}: {generationDate}</Text>
        <Footer locale={locale} generationTimestamp={ts} />
      </Page>

      {/* Test Profile */}
      <Page size="A4" style={s.page}>
        <Header title={l.title} studentName={studentName} generationDate={generationDate} status={status} locale={locale} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>{l.riasec}</Text>
          {riasecResult && <RiasecTable scores={riasecResult.scores} locale={locale} />}
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{l.bigfive}</Text>
          {bigfiveResult && <BigFiveSection scores={bigfiveResult.scores} locale={locale} />}
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{l.values}</Text>
          {valuesResult && <ValuesSection scores={valuesResult.scores} locale={locale} />}
        </View>
        <Footer locale={locale} generationTimestamp={ts} />
      </Page>

      {/* Debrief Insights */}
      <Page size="A4" style={s.page}>
        <Header title={l.title} studentName={studentName} generationDate={generationDate} status={status} locale={locale} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>{l.debrief}</Text>
          {debriefInsights.map((insight, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={s.subTitle}>{insight.testType.toUpperCase()}</Text>
              <Text style={s.text}>{insight.summary}</Text>
              <Text style={s.subTitle}>{l.themes}</Text>
              {insight.keyThemes.map((t, j) => <Text key={j} style={s.bullet}>• {t}</Text>)}
              <Text style={s.subTitle}>{l.strengths}</Text>
              {insight.revealedStrengths.map((st, j) => <Text key={j} style={s.bullet}>• {st}</Text>)}
            </View>
          ))}
        </View>
        <Footer locale={locale} generationTimestamp={ts} />
      </Page>

      {/* Career Analysis + AI Impact */}
      <Page size="A4" style={s.page}>
        <Header title={l.title} studentName={studentName} generationDate={generationDate} status={status} locale={locale} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>{l.careers}</Text>
          {careerMatches.slice(0, 5).map((cm, i) => (
            <View key={i} style={s.careerCard}>
              <Text style={s.careerName}>{cm.career.nameFr}</Text>
              <Text style={s.badge}>{l.matchScore}: {Math.round(cm.matchScore)}%</Text>
              {cm.topReasons.map((r, j) => <Text key={j} style={s.bullet}>• {r}</Text>)}
            </View>
          ))}
        </View>
        {aiImpactData && aiImpactData.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.aiImpact}</Text>
            {aiImpactData.slice(0, 5).map((ai, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={s.subTitle}>{ai.career}</Text>
                <Text style={s.bullet}>{l.automatable}: {ai.automatable.join(", ")}</Text>
                <Text style={s.bullet}>{l.resistant}: {ai.resistant.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}
        <Footer locale={locale} generationTimestamp={ts} />
      </Page>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Page size="A4" style={s.page}>
          <Header title={l.title} studentName={studentName} generationDate={generationDate} status={status} locale={locale} />
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.recommendations}</Text>
            {recommendations.map((rec, i) => <Text key={i} style={s.text}>{i + 1}. {rec}</Text>)}
          </View>
          <Footer locale={locale} generationTimestamp={ts} />
        </Page>
      )}
    </Document>
  );
}
