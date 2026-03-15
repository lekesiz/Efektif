"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { trpc } from "@/lib/trpc/client";
import { JOURNEY_STAGES, TEST_TYPES } from "@efektif/shared";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Brain,
  Fingerprint,
  Heart,
  TrendingUp,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const JOURNEY_ICONS: Record<string, React.ReactNode> = {
  profile: <Fingerprint size={18} />,
  documents: <FileText size={18} />,
  tests: <Brain size={18} />,
  debrief: <Heart size={18} />,
  careers: <Briefcase size={18} />,
  analysis: <TrendingUp size={18} />,
  admission: <GraduationCap size={18} />,
};

const JOURNEY_LABELS: Record<string, string> = {
  profile: "journey.profile",
  documents: "journey.documents",
  tests: "journey.tests",
  debrief: "journey.debrief",
  careers: "journey.careers",
  analysis: "journey.analysis",
  admission: "journey.admission",
};

const TEST_CONFIG = [
  { type: "riasec" as const, icon: <Brain size={24} />, color: "blue" },
  { type: "bigfive" as const, icon: <Fingerprint size={24} />, color: "purple" },
  { type: "values" as const, icon: <Heart size={24} />, color: "rose" },
] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
};

export default function DashboardPage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const { data: testResults } = trpc.tests.results.useQuery();

  const completedTests = new Set(
    testResults?.map((r) => r.testType) ?? [],
  );

  // Determine current journey stage based on completed tests
  const currentStageIndex = completedTests.size >= TEST_TYPES.length ? 4 : 2;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("dashboard.welcome", { name: user?.name ?? "" })}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Journey Progress */}
      <section className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("dashboard.journey")}
        </h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {JOURNEY_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage} className="flex items-center">
                <div
                  className={`
                    flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 text-center
                    transition-colors min-w-[80px]
                    ${
                      isCompleted
                        ? "text-green-700 dark:text-green-400"
                        : isCurrent
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                >
                  <div
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-full
                      ${
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900/30"
                          : isCurrent
                            ? "bg-blue-100 ring-2 ring-blue-400 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-gray-700"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      JOURNEY_ICONS[stage] ?? <Circle size={18} />
                    )}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {t(JOURNEY_LABELS[stage] ?? stage)}
                  </span>
                </div>
                {index < JOURNEY_STAGES.length - 1 && (
                  <div
                    className={`h-0.5 w-6 shrink-0 ${
                      isCompleted
                        ? "bg-green-300 dark:bg-green-700"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Test Status Cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("dashboard.tests")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEST_CONFIG.map(({ type, icon, color }) => {
            const isComplete = completedTests.has(type);
            const result = testResults?.find((r) => r.testType === type);
            const colors = COLOR_MAP[color]!;

            return (
              <div
                key={type}
                className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${colors.text}`}>
                    {icon}
                  </div>
                  {isComplete && (
                    <CheckCircle2
                      size={20}
                      className="text-green-500"
                    />
                  )}
                </div>
                <h3 className={`mt-3 text-base font-semibold ${colors.text}`}>
                  {t(`tests.${type}.title`)}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isComplete
                    ? t("dashboard.testCompleted", {
                        date: result?.completedAt
                          ? new Date(result.completedAt).toLocaleDateString()
                          : "",
                      })
                    : t("dashboard.testPending")}
                </p>
                <Link
                  href={isComplete ? `/results?test=${type}` : `/tests/${type}`}
                  className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${colors.text} hover:underline`}
                >
                  {isComplete
                    ? t("dashboard.viewResults")
                    : t("dashboard.startTest")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("dashboard.stats.testsCompleted")}
          value={completedTests.size}
          total={TEST_TYPES.length}
        />
        <StatCard
          label={t("dashboard.stats.journeyProgress")}
          value={currentStageIndex}
          total={JOURNEY_STAGES.length}
        />
        <StatCard
          label={t("dashboard.stats.favoriteCareers")}
          value={0}
        />
        <StatCard
          label={t("dashboard.stats.messages")}
          value={0}
        />
      </section>

      {/* Next Step CTA */}
      <section className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboard.nextStep.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t("dashboard.nextStep.description")}
            </p>
          </div>
          <Link
            href={completedTests.size < TEST_TYPES.length ? "/tests" : "/careers"}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {t("dashboard.nextStep.cta")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total?: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {total != null && (
          <span className="text-base font-normal text-gray-400">
            /{total}
          </span>
        )}
      </p>
    </div>
  );
}
