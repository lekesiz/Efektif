import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Locale } from "@efektif/shared";

const COPYRIGHT: Record<Locale, string> = {
  fr: "Efektif — Tous droits réservés",
  tr: "Efektif — Tüm hakları saklıdır",
  en: "Efektif — All rights reserved",
};

interface FooterProps {
  locale: Locale;
  generationTimestamp: string;
}

const s = StyleSheet.create({
  container: { position: "absolute", bottom: 20, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8 },
  text: { fontSize: 7, color: "#94a3b8" },
  page: { fontSize: 7, color: "#64748b" },
});

export function Footer({ locale, generationTimestamp }: FooterProps) {
  return (
    <View style={s.container} fixed>
      <Text style={s.text}>{COPYRIGHT[locale]}</Text>
      <Text style={s.text}>{generationTimestamp}</Text>
      <Text style={s.page} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}
