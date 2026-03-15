import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Locale, TestResult } from "@efektif/shared";
import { BIGFIVE_META, VALUES_META, getDimensionLabel } from "@efektif/shared";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { RiasecTable } from "../components/riasec-table";
import { ScoreBar } from "../components/score-bar";

const TITLES: Record<Locale, string> = {
  fr: "Résultats des Tests",
  tr: "Test Sonuçları",
  en: "Test Results",
};

export interface TestResultsProps {
  studentName: string;
  locale: Locale;
  generationDate: string;
  testResults: TestResult[];
}

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 50, paddingHorizontal: 40, fontSize: 10, color: "#1e293b" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#3b82f6", marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  dimLabel: { fontSize: 9, width: 110, color: "#1e293b" },
  barCol: { flex: 1 },
});

export function TestResultsPDF({ studentName, locale, generationDate, testResults }: TestResultsProps) {
  const ts = new Date().toISOString();
  const title = TITLES[locale];
  const riasec = testResults.find((t) => t.testType === "riasec");
  const bigfive = testResults.find((t) => t.testType === "bigfive");
  const values = testResults.find((t) => t.testType === "values");

  return (
    <Document title={title} author="Efektif">
      <Page size="A4" style={s.page}>
        <Header title={title} studentName={studentName} generationDate={generationDate} status="validated" locale={locale} />

        {riasec && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>RIASEC</Text>
            <RiasecTable scores={riasec.scores} locale={locale} />
          </View>
        )}

        {bigfive && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Big Five</Text>
            {(["O", "C", "E", "A", "N"] as const).map((dim) => (
              <View style={s.row} key={dim}>
                <Text style={s.dimLabel}>{getDimensionLabel(BIGFIVE_META, dim, locale)}</Text>
                <View style={s.barCol}>
                  <ScoreBar value={bigfive.scores[dim] ?? 0} color={BIGFIVE_META[dim].color} />
                </View>
              </View>
            ))}
          </View>
        )}

        {values && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{locale === "fr" ? "Valeurs" : locale === "tr" ? "Değerler" : "Values"}</Text>
            {Object.entries(values.scores)
              .sort(([, a], [, b]) => b - a)
              .map(([key, val]) => (
                <View style={s.row} key={key}>
                  <Text style={s.dimLabel}>{getDimensionLabel(VALUES_META, key, locale)}</Text>
                  <View style={s.barCol}>
                    <ScoreBar value={val} color={VALUES_META[key as keyof typeof VALUES_META]?.color ?? "#95a5a6"} />
                  </View>
                </View>
              ))}
          </View>
        )}

        <Footer locale={locale} generationTimestamp={ts} />
      </Page>
    </Document>
  );
}
