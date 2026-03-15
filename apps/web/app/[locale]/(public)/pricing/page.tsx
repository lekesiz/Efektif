"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Check, X, Star } from "lucide-react";

const PLANS = [
  {
    key: "free",
    price: 0,
    features: ["tests_3", "riasec_profile", "basic_results", "community_access"],
    excluded: ["ai_debrief", "career_matching", "diagnostic_report", "admission_tools", "counselor_access", "priority_support"],
  },
  {
    key: "standard",
    price: 99,
    features: ["tests_3", "riasec_profile", "basic_results", "community_access", "ai_debrief", "career_matching", "diagnostic_report"],
    excluded: ["admission_tools", "counselor_access", "priority_support"],
  },
  {
    key: "premium",
    price: 199,
    popular: true,
    features: ["tests_3", "riasec_profile", "basic_results", "community_access", "ai_debrief", "career_matching", "diagnostic_report", "admission_tools", "counselor_access", "priority_support"],
    excluded: [],
  },
] as const;

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-center text-lg text-gray-600 dark:text-gray-400">{t("subtitle")}</p>

      <div className="mt-12 grid w-full max-w-5xl gap-8 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.key} className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm dark:bg-gray-800 ${plan.popular ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200 dark:border-gray-700"}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                <Star size={12} fill="currentColor" />
                {t("mostPopular")}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t(`plans.${plan.key}.name`)}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(`plans.${plan.key}.description`)}</p>

            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price === 0 ? t("free") : `${plan.price}\u20AC`}</span>
              {plan.price > 0 && <span className="ml-1 text-sm text-gray-500">/ {t("oneTime")}</span>}
            </div>

            <Link
              href={plan.price === 0 ? "/register" : `/register?plan=${plan.key}`}
              className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"}`}
            >
              {plan.price === 0 ? t("getStarted") : t("subscribe")}
            </Link>

            <div className="mt-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="shrink-0 text-green-500" />
                  {t(`features.${f}`)}
                </div>
              ))}
              {plan.excluded.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                  <X size={16} className="shrink-0" />
                  {t(`features.${f}`)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">{t("guarantee")}</p>
    </div>
  );
}
