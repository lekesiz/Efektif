import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface ScoreBarProps {
  value: number;
  maxValue?: number;
  color: string;
  height?: number;
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  track: { flex: 1, height: 10, backgroundColor: "#f1f5f9", borderRadius: 4 },
  fill: { height: 10, borderRadius: 4, minWidth: 2 },
  label: { fontSize: 9, color: "#334155", width: 36, textAlign: "right" },
});

export function ScoreBar({ value, maxValue = 100, color, height }: ScoreBarProps) {
  const pct = Math.min(Math.round((value / maxValue) * 100), 100);
  const trackStyle = height ? { ...s.track, height } : s.track;
  const fillStyle = height ? { ...s.fill, height } : s.fill;

  return (
    <View style={s.row}>
      <View style={trackStyle}>
        <View style={[fillStyle, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.label}>{pct}%</Text>
    </View>
  );
}
