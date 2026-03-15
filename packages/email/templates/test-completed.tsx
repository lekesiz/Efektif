import { Html, Head, Body, Container, Heading, Text, Button, Preview, Section } from "@react-email/components";
import * as React from "react";

interface TestCompletedEmailProps {
  name: string;
  testName: string;
  resultsUrl: string;
  locale: "fr" | "tr" | "en";
}

const COPY = {
  fr: {
    preview: "Vos résultats sont prêts",
    heading: "Vos résultats sont prêts !",
    body: (name: string, test: string) => `Bonjour ${name}, vous avez terminé le test ${test}. Vos résultats sont maintenant disponibles.`,
    cta: "Voir mes résultats",
  },
  tr: {
    preview: "Sonuçlarınız hazır",
    heading: "Sonuçlarınız hazır!",
    body: (name: string, test: string) => `Merhaba ${name}, ${test} testini tamamladınız. Sonuçlarınız artık hazır.`,
    cta: "Sonuçları Gör",
  },
  en: {
    preview: "Your results are ready",
    heading: "Your results are ready!",
    body: (name: string, test: string) => `Hello ${name}, you have completed the ${test} test. Your results are now available.`,
    cta: "View Results",
  },
};

export default function TestCompletedEmail({ name, testName, resultsUrl, locale }: TestCompletedEmailProps) {
  const c = COPY[locale] ?? COPY.fr;
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", maxWidth: "480px", margin: "0 auto" }}>
          <Heading style={{ fontSize: "24px", color: "#1e293b", marginBottom: "16px" }}>{c.heading}</Heading>
          <Text style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{c.body(name, testName)}</Text>
          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <Button href={resultsUrl} style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              {c.cta}
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
