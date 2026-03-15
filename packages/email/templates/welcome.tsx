import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Preview,
  Section,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  locale: "fr" | "tr" | "en";
  dashboardUrl: string;
}

const COPY = {
  fr: {
    preview: "Bienvenue sur Efektif",
    heading: "Bienvenue sur Efektif !",
    greeting: (name: string) => `Bonjour ${name},`,
    body: "Votre compte a été créé avec succès. Commencez dès maintenant votre parcours d'orientation professionnelle en passant nos tests psychométriques.",
    cta: "Accéder au tableau de bord",
    footer: "L'équipe Efektif",
  },
  tr: {
    preview: "Efektif'e Hoş Geldiniz",
    heading: "Efektif'e Hoş Geldiniz!",
    greeting: (name: string) => `Merhaba ${name},`,
    body: "Hesabınız başarıyla oluşturuldu. Psikometrik testlerimizi tamamlayarak kariyer yolculuğunuza hemen başlayın.",
    cta: "Panele Git",
    footer: "Efektif Ekibi",
  },
  en: {
    preview: "Welcome to Efektif",
    heading: "Welcome to Efektif!",
    greeting: (name: string) => `Hello ${name},`,
    body: "Your account has been created successfully. Start your career guidance journey now by completing our psychometric tests.",
    cta: "Go to Dashboard",
    footer: "The Efektif Team",
  },
};

export default function WelcomeEmail({ name, locale, dashboardUrl }: WelcomeEmailProps) {
  const c = COPY[locale] ?? COPY.fr;
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", maxWidth: "480px", margin: "0 auto" }}>
          <Heading style={{ fontSize: "24px", color: "#1e293b", marginBottom: "16px" }}>{c.heading}</Heading>
          <Text style={{ fontSize: "16px", color: "#334155" }}>{c.greeting(name)}</Text>
          <Text style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{c.body}</Text>
          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <Button href={dashboardUrl} style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              {c.cta}
            </Button>
          </Section>
          <Text style={{ fontSize: "12px", color: "#94a3b8", marginTop: "32px", textAlign: "center" }}>{c.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}
