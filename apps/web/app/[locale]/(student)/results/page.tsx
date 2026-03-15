"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import {
  TEST_TYPES,
  PAID_ACCESS_LEVELS,
  RIASEC_DIMENSIONS,
} from "@efektif/shared";
import type { TestType } from "@efektif/shared";
import {
  RIASEC_META,
  getDimensionLabel,
  getDimensionColor,
} from "@efektif/shared/psychometric";
import { RiasecRadar } from "@/components/charts/riasec-radar";
import { BigFiveBars } from "@/components/charts/bigfive-bars";
import { ValuesRanking } from "@/components/charts/values-ranking";
import {
  Brain,
  Fingerprint,
  Heart,
  Lock,
  Sparkles,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const TAB_CONFIG: Record<TestType, { icon: typeof Brain; color: string; bg: string }> = {
  riasec: { icon: Brain, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  bigfive: { icon: Fingerprint, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
  values: { icon: Heart, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
};

export default function ResultsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const initialTab = (searchParams.get("test") as TestType) ?? "riasec";
  const [activeTab, setActiveTab] = useState<TestType>(initialTab);

  const { data: testResults, isLoading } = trpc.tests.results.useQuery();
  const userAccess = user?.accessLevel ?? "free";
  const isPaid = PAID_ACCESS_LEVELS.includes(userAccess as "standard" | "premium");

  const completedTests = new Set(testResults?.map((r) => r.testType) ?? []);
  const currentResult = testResults?.find((r) => r.testType === activeTab);
  const locale = "fr"; // Will be derived from params in production

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("results.title")}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {t("results.subtitle")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-700 dark:bg-gray-800">
        {TEST_TYPES.map((type) => {
          const config = TAB_CONFIG[type];
          const Icon = config.icon;
          const isActive = activeTab === type;
          const isCompleted = completedTests.has(type);
          const isLocked = type !== "riasec" && !isPaid;

          return (
            <button
              key={type}
              onClick={() => !isLocked && setActiveTab(type)}
              disabled={isLocked}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? `${config.bg} ${config.color} shadow-sm`
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              } ${isLocked ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isLocked ? <Lock size={16} /> : <Icon size={16} />}
              <span className="hidden sm:inline">{t(`tests.${type}.title`)}</span>
              {isCompleted && <CheckCircle2 size={14} className="text-green-500" />}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        {!currentResult ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
              {(() => {
                const Icon = TAB_CONFIG[activeTab].icon;
                return <Icon size={32} className="text-gray-400" />;
              })()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("results.noResults")}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {t("results.noResultsDesc")}
            </p>
            <Link
              href={`/tests/${activeTab}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("results.startTest")}
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* RIASEC Tab */}
            {activeTab === "riasec" && (
              <>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <RiasecRadar scores={currentResult.scores} locale={locale} size={320} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {RIASEC_DIMENSIONS.map((dim) => {
                    const score = currentResult.scores[dim] ?? 0;
                    const label = getDimensionLabel(RIASEC_META, dim, locale);
                    const color = getDimensionColor(RIASEC_META, dim);
                    return (
                      <div
                        key={dim}
                        className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-semibold"
                            style={{ color }}
                          >
                            {label}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {score}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${score}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* BigFive Tab */}
            {activeTab === "bigfive" && (
              <BigFiveBars scores={currentResult.scores} locale={locale} />
            )}

            {/* Values Tab */}
            {activeTab === "values" && (
              <ValuesRanking scores={currentResult.scores} locale={locale} />
            )}

            {/* Debrief CTA */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-900/20">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-100 p-2.5 dark:bg-indigo-900/40">
                  <MessageSquare size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-200">
                    {t("results.debriefTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                    {t("results.debriefDesc")}
                  </p>
                  {isPaid ? (
                    <Link
                      href={`/tests/${activeTab}/debrief`}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      <Sparkles size={16} />
                      {t("results.startDebrief")}
                    </Link>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                      <Lock size={14} />
                      <span>{t("results.premiumOnly")}</span>
                      <Link
                        href="/pricing"
                        className="ml-1 font-medium underline hover:no-underline"
                      >
                        {t("results.upgrade")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
