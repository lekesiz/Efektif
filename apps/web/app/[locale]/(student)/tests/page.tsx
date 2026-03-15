"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import {
  RIASEC_QUESTION_COUNT,
  BIGFIVE_QUESTION_COUNT,
  VALUES_QUESTION_COUNT,
  PAID_ACCESS_LEVELS,
} from "@efektif/shared";
import type { AccessLevel, TestType } from "@efektif/shared";
import {
  Brain,
  Fingerprint,
  Heart,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface TestCardConfig {
  type: TestType;
  icon: React.ReactNode;
  questionCount: number;
  color: string;
  bgColor: string;
  borderColor: string;
  requiredAccess: AccessLevel;
  estimatedMinutes: number;
}

const TEST_CARDS: TestCardConfig[] = [
  {
    type: "riasec",
    icon: <Brain size={28} />,
    questionCount: RIASEC_QUESTION_COUNT,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    requiredAccess: "free",
    estimatedMinutes: 10,
  },
  {
    type: "bigfive",
    icon: <Fingerprint size={28} />,
    questionCount: BIGFIVE_QUESTION_COUNT,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    requiredAccess: "standard",
    estimatedMinutes: 15,
  },
  {
    type: "values",
    icon: <Heart size={28} />,
    questionCount: VALUES_QUESTION_COUNT,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    requiredAccess: "standard",
    estimatedMinutes: 10,
  },
];

type TestStatus = "not_started" | "in_progress" | "completed";

function StatusBadge({ status, t }: { status: TestStatus; t: (key: string) => string }) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 size={12} />
          {t("tests.status.completed")}
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock size={12} />
          {t("tests.status.inProgress")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {t("tests.status.notStarted")}
        </span>
      );
  }
}

export default function TestsPage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const { data: testResults } = trpc.tests.results.useQuery();
  const { data: riasecDraft } = trpc.tests.loadDraft.useQuery({ testType: "riasec" });
  const { data: bigfiveDraft } = trpc.tests.loadDraft.useQuery({ testType: "bigfive" });
  const { data: valuesDraft } = trpc.tests.loadDraft.useQuery({ testType: "values" });

  const completedTests = new Set(testResults?.map((r) => r.testType) ?? []);

  const drafts: Record<TestType, boolean> = {
    riasec: riasecDraft != null,
    bigfive: bigfiveDraft != null,
    values: valuesDraft != null,
  };

  function getStatus(type: TestType): TestStatus {
    if (completedTests.has(type)) return "completed";
    if (drafts[type]) return "in_progress";
    return "not_started";
  }

  const userAccess = user?.accessLevel ?? "free";
  const isPaid = PAID_ACCESS_LEVELS.includes(userAccess as "standard" | "premium");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("tests.title")}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {t("tests.subtitle")}
        </p>
      </div>

      {/* Test Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEST_CARDS.map((card) => {
          const status = getStatus(card.type);
          const isLocked =
            card.requiredAccess !== "free" && !isPaid;

          return (
            <div
              key={card.type}
              className={`relative flex flex-col rounded-xl border p-6 transition-shadow hover:shadow-md ${card.borderColor} ${card.bgColor}`}
            >
              {/* Lock overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
                  <Lock size={32} className="mb-3 text-gray-400" />
                  <p className="mb-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t("tests.premiumRequired")}
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Sparkles size={14} />
                    {t("tests.upgrade")}
                  </Link>
                </div>
              )}

              {/* Icon + Status */}
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${card.color} ${card.bgColor}`}>
                  {card.icon}
                </div>
                <StatusBadge status={status} t={t} />
              </div>

              {/* Title + Description */}
              <h3 className={`mt-4 text-lg font-semibold ${card.color}`}>
                {t(`tests.${card.type}.title`)}
              </h3>
              <p className="mt-1.5 flex-1 text-sm text-gray-600 dark:text-gray-400">
                {t(`tests.${card.type}.description`)}
              </p>

              {/* Meta */}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{card.questionCount} {t("tests.questions")}</span>
                <span>~{card.estimatedMinutes} min</span>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {status === "completed" ? (
                  <Link
                    href={`/results?test=${card.type}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${card.borderColor} ${card.color} hover:opacity-80`}
                  >
                    {t("tests.viewResults")}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href={`/tests/${card.type}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    {status === "in_progress"
                      ? t("tests.resume")
                      : t("tests.start")}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {t("tests.info.title")}
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>{t("tests.info.noRightWrong")}</li>
          <li>{t("tests.info.saveProgress")}</li>
          <li>{t("tests.info.retake")}</li>
        </ul>
      </div>
    </div>
  );
}
