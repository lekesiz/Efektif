"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ListOrdered, GraduationCap, TrendingUp, ShieldAlert, ShieldCheck, Lightbulb, ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { RIASEC_META, getDimensionLabel, getDimensionColor, calculateFutureScore, RIASEC_DIMENSIONS } from "@efektif/shared";
import type { Locale, CareerSummary } from "@efektif/shared";
import { RiasecRadar } from "@/components/charts/riasec-radar";

function getCareerName(c: CareerSummary, locale: string): string {
  if (locale === "tr" && c.nameTr) return c.nameTr;
  if (locale === "en" && c.nameEn) return c.nameEn;
  return c.nameFr;
}

export default function CareerDetailPage() {
  const { code } = useParams<{ code: string }>();
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const { data: career, isLoading } = trpc.careers.getByCode.useQuery({ code });
  const { data: favorites } = trpc.favorites.list.useQuery();
  const { data: testResults } = trpc.tests.results.useQuery();
  const addFav = trpc.favorites.add.useMutation();
  const removeFav = trpc.favorites.remove.useMutation();
  const utils = trpc.useUtils();

  const favoriteIds = new Set(favorites?.map((f) => f.careerId) ?? []);
  const isFav = career ? favoriteIds.has(career.id) : false;
  const riasecResult = testResults?.find((r) => r.testType === "riasec");

  function handleToggleFavorite() {
    if (!career) return;
    const opts = { onSuccess: () => utils.favorites.list.invalidate() };
    isFav ? removeFav.mutate({ careerId: career.id }, opts) : addFav.mutate({ careerId: career.id }, opts);
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>;

  if (!career) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t("careers.notFound")}</p>
        <Link href="/careers" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><ArrowLeft size={14} />{t("careers.backToList")}</Link>
      </div>
    );
  }

  const futureScore = calculateFutureScore(
    { aiImpactScore: career.aiImpactScore ?? undefined, salaryMedian: career.salaryMin ?? undefined },
    locale,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link href="/careers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft size={14} />{t("careers.backToList")}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getCareerName(career, locale)}</h1>
          {career.category && (
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {career.category}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              isFav
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
            )}
          >
            <Heart size={15} className={cn(isFav && "fill-current")} />
            {isFav ? t("careers.removeFavorite") : t("careers.addFavorite")}
          </button>
          <Link
            href="/careers?tab=ranking"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ListOrdered size={15} />
            {t("careers.addToPriorities")}
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title={t("careers.details")} icon={<Briefcase size={18} />}>
          <InfoRow label={t("careers.education")} value={career.educationLevel ?? "-"} icon={<GraduationCap size={15} />} />
          <InfoRow
            label={t("careers.salary")}
            value={career.salaryMin != null && career.salaryMax != null ? `${(career.salaryMin / 1000).toFixed(0)}k - ${(career.salaryMax / 1000).toFixed(0)}k \u20ac` : "-"}
          />
          <InfoRow label={t("careers.code")} value={career.code} />
        </Section>

        <Section title={t("careers.futureScore")} icon={<TrendingUp size={18} />}>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4" style={{ borderColor: futureScore.color }}>
              <span className="text-xl font-bold" style={{ color: futureScore.color }}>{futureScore.score}</span>
            </div>
            <div>
              <p className="font-semibold" style={{ color: futureScore.color }}>{futureScore.label}</p>
              <div className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                <p>{t("careers.aiResilience")}: {futureScore.components.aiResilience}%</p>
                <p>{t("careers.marketDemand")}: {futureScore.components.marketDemand}%</p>
                <p>{t("careers.salaryAttractiveness")}: {futureScore.components.salaryAttractiveness}%</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section title={t("careers.aiImpactAnalysis")} icon={<ShieldAlert size={18} />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
              <ShieldAlert size={14} />{t("careers.automatableTasks")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("careers.aiImpactPlaceholder")}</p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
              <ShieldCheck size={14} />{t("careers.resistantTasks")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("careers.aiResistantPlaceholder")}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
            <Lightbulb size={14} />{t("careers.futureSkills")}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("careers.futureSkillsPlaceholder")}</p>
        </div>
      </Section>

      {riasecResult && (
        <Section title={t("careers.riasecComparison")} icon={<Briefcase size={18} />}>
          <div className="flex justify-center">
            <RiasecRadar scores={riasecResult.scores} locale={locale} size={300} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {RIASEC_DIMENSIONS.map((dim) => (
              <div key={dim} className="text-center">
                <div className="text-xs font-medium" style={{ color: getDimensionColor(RIASEC_META, dim) }}>
                  {getDimensionLabel(RIASEC_META, dim, locale)}
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {riasecResult.scores[dim] ?? 0}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">{icon}{title}</h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0 dark:border-gray-700">
      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">{icon}{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
