import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Locale } from "@efektif/shared";

const LABELS = {
  fr: { draft: "Brouillon", validated: "Validé", published: "Publié" },
  tr: { draft: "Taslak", validated: "Onaylı", published: "Yayınlandı" },
  en: { draft: "Draft", validated: "Validated", published: "Published" },
} as const;

export type ReportStatus = "draft" | "validated" | "published";

interface HeaderProps {
  title: string;
  studentName: string;
  generationDate: string;
  status: ReportStatus;
  locale: Locale;
}

const STATUS_COLORS: Record<ReportStatus, string> = {
  draft: "#f39c12",
  validated: "#2ecc71",
  published: "#3498db",
};

const s = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: "#3b82f6", marginBottom: 20 },
  left: { flexDirection: "column" },
  logo: { fontSize: 22, fontWeight: "bold", color: "#3b82f6", marginBottom: 4 },
  title: { fontSize: 14, color: "#1e293b", marginBottom: 2 },
  sub: { fontSize: 9, color: "#64748b" },
  right: { alignItems: "flex-end" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 4 },
  badgeText: { fontSize: 8, color: "#ffffff", fontWeight: "bold", textTransform: "uppercase" },
  date: { fontSize: 8, color: "#94a3b8" },
});

export function Header({ title, studentName, generationDate, status, locale }: HeaderProps) {
  const statusLabel = LABELS[locale][status];
  return (
    <View style={s.container} fixed>
      <View style={s.left}>
        <Text style={s.logo}>Efektif</Text>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{studentName}</Text>
      </View>
      <View style={s.right}>
        <View style={[s.badge, { backgroundColor: STATUS_COLORS[status] }]}>
          <Text style={s.badgeText}>{statusLabel}</Text>
        </View>
        <Text style={s.date}>{generationDate}</Text>
      </View>
    </View>
  );
}
