import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Politique de confidentialité</h1>
      <p className="mb-6 text-muted-foreground">Dernière mise à jour : mars 2026</p>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">1. Responsable du traitement</h2>
        <p>Netz Informatique - Mikail Lekesiz, 7 rue de la Durance, 68100 Mulhouse, France.</p>
        <p>Contact : contact@efektif.net</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">2. Données collectées</h2>
        <ul className="ml-6 list-disc space-y-1">
          <li>Données d&apos;identification : nom, prénom, email</li>
          <li>Données de profil : date de naissance, ville, niveau scolaire</li>
          <li>Résultats de tests psychométriques (RIASEC, Big Five, Valeurs)</li>
          <li>Documents téléchargés (CV, lettre de motivation)</li>
          <li>Données de navigation : cookies, adresse IP, pages visitées</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">3. Finalités du traitement</h2>
        <ul className="ml-6 list-disc space-y-1">
          <li>Fourniture du service d&apos;orientation professionnelle</li>
          <li>Analyse psychométrique et recommandations de carrière par IA</li>
          <li>Communication avec les conseillers d&apos;orientation</li>
          <li>Amélioration du service et statistiques anonymisées</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">4. Base légale</h2>
        <p>Le traitement est fondé sur le consentement de l&apos;utilisateur (art. 6.1.a RGPD) et l&apos;exécution du contrat (art. 6.1.b RGPD).</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">5. Durée de conservation</h2>
        <p>Les données sont conservées pendant la durée du compte utilisateur, puis supprimées dans un délai de 30 jours après la suppression du compte.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">6. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, portabilité, limitation et opposition. Contactez-nous à contact@efektif.net.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">7. Cookies</h2>
        <p>Nous utilisons des cookies essentiels (session, préférences) et analytiques (Google Analytics). Vous pouvez gérer vos préférences via la bannière de cookies.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">8. Sous-traitants</h2>
        <p>Vercel (hébergement), Neon (base de données), Anthropic (IA), Resend (emails), Stripe (paiements). Tous conformes au RGPD.</p>
      </section>
    </article>
  );
}
