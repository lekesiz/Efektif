import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions générales d'utilisation" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Conditions générales d&apos;utilisation</h1>
      <p className="mb-6 text-muted-foreground">Dernière mise à jour : mars 2026</p>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">1. Objet</h2>
        <p>Les présentes CGU régissent l&apos;utilisation de la plateforme Efektif, un service d&apos;orientation professionnelle assisté par intelligence artificielle, édité par Netz Informatique.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">2. Description du service</h2>
        <p>Efektif propose des tests psychométriques (RIASEC, Big Five, Valeurs professionnelles), des recommandations de carrière par IA, un accompagnement par des conseillers d&apos;orientation et une aide à la constitution de dossiers d&apos;admission.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">3. Inscription</h2>
        <p>L&apos;accès au service nécessite la création d&apos;un compte. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">4. Obligations de l&apos;utilisateur</h2>
        <ul className="ml-6 list-disc space-y-1">
          <li>Utiliser le service conformément à sa destination</li>
          <li>Ne pas tenter de compromettre la sécurité du système</li>
          <li>Ne pas partager son compte avec des tiers</li>
          <li>Respecter la propriété intellectuelle du contenu</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">5. Tarification</h2>
        <p>Certaines fonctionnalités sont accessibles gratuitement. Les offres Standard et Premium sont soumises à paiement. Les prix sont indiqués en euros TTC sur la page de tarification.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">6. Limitation de responsabilité</h2>
        <p>Les recommandations fournies par l&apos;IA sont indicatives et ne constituent pas un conseil professionnel certifié. Efektif ne garantit pas l&apos;admission dans un établissement ni l&apos;obtention d&apos;un emploi.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">7. Résiliation</h2>
        <p>L&apos;utilisateur peut supprimer son compte à tout moment. Netz Informatique se réserve le droit de suspendre un compte en cas de violation des présentes CGU.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">8. Droit applicable</h2>
        <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Mulhouse.</p>
      </section>
    </article>
  );
}
