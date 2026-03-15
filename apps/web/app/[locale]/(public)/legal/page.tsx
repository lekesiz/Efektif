import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Mentions légales</h1>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Éditeur du site</h2>
        <p>Raison sociale : Netz Informatique (Efektif)</p>
        <p>Forme juridique : Micro-entreprise</p>
        <p>Responsable : Mikail Lekesiz</p>
        <p>SIRET : 93203484200013</p>
        <p>Adresse : 7 rue de la Durance, 68100 Mulhouse, France</p>
        <p>Email : contact@efektif.net</p>
        <p>Téléphone : +33 7 56 94 72 07</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Hébergement</h2>
        <p>Vercel Inc.</p>
        <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
        <p>Site : https://vercel.com</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes)
          est protégé par le droit d&apos;auteur. Toute reproduction est interdite
          sans autorisation préalable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Responsabilité</h2>
        <p>
          Netz Informatique s&apos;efforce de fournir des informations exactes et à
          jour. Toutefois, elle ne saurait être tenue responsable des erreurs,
          omissions ou résultats obtenus suite à l&apos;utilisation de ces informations.
        </p>
      </section>
    </article>
  );
}
