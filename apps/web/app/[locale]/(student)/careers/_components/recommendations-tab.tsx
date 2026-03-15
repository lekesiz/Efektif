"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpDown, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { calculateFutureScore } from "@efektif/shared";
import type { Locale } from "@efektif/shared";
import { CareerCard } from "./career-card";

type SortMode = "compatibility" | "future";

export function RecommendationsTab() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [sortMode, setSortMode] = useState<SortMode>("compatibility");
  const { data: matches, isLoading } = trpc.careers.smartMatch.useQuery();
  const { data: favorites } = trpc.favorites.list.useQuery();
  const addFav = trpc.favorites.add.useMutation();
  const removeFav = trpc.favorites.remove.useMutation();
  const utils = trpc.useUtils();

  const favoriteIds = new Set(favorites?.map((f) => f.careerId) ?? []);

  function handleToggleFavorite(careerId: string) {
    if (favoriteIds.has(careerId)) {
      removeFav.mutate({ careerId }, { onSuccess: () => utils.favorites.list.invalidate() });
    } else {
      addFav.mutate({ careerId }, { onSuccess: () => utils.favorites.list.invalidate() });
    }
  }

  const sorted = [...(matches ?? [])].sort((a, b) => {
    if (sortMode === "future") {
      const fa = calculateFutureScore({ aiImpactScore: a.career.aiImpactScore ?? undefined, salaryMedian: a.career.salaryMin ?? undefined }, locale);
      const fb = calculateFutureScore({ aiImpactScore: b.career.aiImpactScore ?? undefined, salaryMedian: b.career.salaryMin ?? undefined }, locale);
      return fb.score - fa.score;
    }
    return b.matchScore - a.matchScore;
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Sparkles size={40} className="mb-3 text-gray-300" />
        <p className="text-gray-500 dark:text-gray-400">{t("careers.noRecommendations")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("careers.matchCount", { count: sorted.length })}
        </p>
        <button
          onClick={() => setSortMode((m) => (m === "compatibility" ? "future" : "compatibility"))}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowUpDown size={14} />
          {sortMode === "compatibility" ? t("careers.sortByFuture") : t("careers.sortByMatch")}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((m) => {
          const fs = calculateFutureScore(
            { aiImpactScore: m.career.aiImpactScore ?? undefined, salaryMedian: m.career.salaryMin ?? undefined },
            locale,
          );
          return (
            <CareerCard
              key={m.career.id}
              career={m.career}
              matchScore={Math.round(m.matchScore)}
              futureScore={fs.score}
              futureColor={fs.color}
              isFavorite={favoriteIds.has(m.career.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
}
