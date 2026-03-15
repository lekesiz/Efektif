import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export default function HomePage() {
  const t = useTranslations("landing");

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-heading text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-primary">Efektif</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {t("cta")}
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-border px-8 py-3 font-semibold transition hover:bg-secondary"
          >
            {t("pricing")}
          </Link>
        </div>
      </section>
    </main>
  );
}
