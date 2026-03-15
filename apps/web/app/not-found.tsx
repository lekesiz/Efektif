import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-background font-sans">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Page introuvable
          </p>
          <p className="mt-2 text-muted-foreground">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
