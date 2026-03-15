import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { RIASEC_META, getDimensionLabel } from "@efektif/shared";
import type { Locale } from "@efektif/shared";
import { ScoreBar } from "./score-bar";

interface RiasecTableProps {
  scores: Record<string, number>;
  locale: Locale;
  maxScore?: number;
}

const DIMS = ["R", "I", "A", "S", "E", "C"] as const;

const s = StyleSheet.create({
  table: { marginVertical: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dimLabel: { fontSize: 10, width: 100, color: "#1e293b" },
  barCol: { flex: 1 },
});

export function RiasecTable({ scores, locale, maxScore = 100 }: RiasecTableProps) {
  return (
    <View style={s.table}>
      {DIMS.map((dim) => {
        const meta = RIASEC_META[dim];
        const score = scores[dim] ?? 0;
        return (
          <View style={s.row} key={dim}>
            <View style={[s.dot, { backgroundColor: meta.color }]} />
            <Text style={s.dimLabel}>{getDimensionLabel(RIASEC_META, dim, locale)}</Text>
            <View style={s.barCol}>
              <ScoreBar value={score} maxValue={maxScore} color={meta.color} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
