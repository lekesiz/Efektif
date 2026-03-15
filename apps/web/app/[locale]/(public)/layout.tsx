import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Efektif
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Link href="/" locale="fr">FR</Link>
              <Link href="/" locale="en">EN</Link>
              <Link href="/" locale="tr">TR</Link>
            </div>
            <Link href="/login" className="text-sm font-medium hover:underline">
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Inscription
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl justify-center gap-6 px-4">
          <Link href="/legal" className="hover:underline">Mentions légales</Link>
          <Link href="/privacy" className="hover:underline">Confidentialité</Link>
          <Link href="/terms" className="hover:underline">CGU</Link>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Efektif. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
