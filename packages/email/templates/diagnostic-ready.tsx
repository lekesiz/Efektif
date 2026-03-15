import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Preview,
  Section,
} from "@react-email/components";
import * as React from "react";

interface DiagnosticReadyEmailProps {
  name: string;
  reportUrl: string;
  locale: "fr" | "tr" | "en";
}

const COPY = {
  fr: {
    preview: "Votre analyse de carrière est prête",
    heading: "Votre analyse de carrière est prête !",
    body: (name: string) => `Bonjour ${name}, votre rapport diagnostique a été finalisé. Découvrez vos recommandations personnalisées.`,
    cta: "Voir le rapport",
  },
  tr: {
    preview: "Kariyer analiziniz hazır",
    heading: "Kariyer analiziniz hazır!",
    body: (name: string) => `Merhaba ${name}, tanılama raporunuz tamamlandı. Kişiselleştirilmiş önerilerinizi keşfedin.`,
    cta: "Raporu Gör",
  },
  en: {
    preview: "Your career analysis is complete",
    heading: "Your career analysis is complete!",
    body: (name: string) => `Hello ${name}, your diagnostic report has been finalized. Discover your personalized recommendations.`,
    cta: "View Report",
  },
};

export default function DiagnosticReadyEmail({ name, reportUrl, locale }: DiagnosticReadyEmailProps) {
  const c = COPY[locale] ?? COPY.fr;
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", maxWidth: "480px", margin: "0 auto" }}>
          <Heading style={{ fontSize: "24px", color: "#1e293b", marginBottom: "16px" }}>{c.heading}</Heading>
          <Text style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{c.body(name)}</Text>
          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <Button href={reportUrl} style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              {c.cta}
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
