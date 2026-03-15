"use client";

import { useLocale, useTranslations } from "next-intl";
import { Heart, GraduationCap, TrendingUp } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import type { CareerSummary, Locale } from "@efektif/shared";

interface CareerCardProps {
  career: CareerSummary; matchScore?: number; futureScore?: number; futureColor?: string;
  isFavorite?: boolean; onToggleFavorite?: (careerId: string) => void; compact?: boolean;
}

function getCareerName(career: CareerSummary, locale: string): string {
  if (locale === "tr" && career.nameTr) return career.nameTr;
  if (locale === "en" && career.nameEn) return career.nameEn;
  return career.nameFr;
}

export function CareerCard({ career, matchScore, futureScore, futureColor, isFavorite = false, onToggleFavorite, compact = false }: CareerCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <div className="group relative rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(career.id); }}
          className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t(isFavorite ? "careers.removeFavorite" : "careers.addFavorite")}
        >
          <Heart size={18} className={cn(isFavorite ? "fill-red-500 text-red-500" : "text-gray-400")} />
        </button>
      )}
      <Link href={`/careers/${career.code}`} className="block">
        <div className="flex items-start gap-3">
          {matchScore != null && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {matchScore}%
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900 dark:text-white">
              {getCareerName(career, locale)}
            </h3>
            {career.category && (
              <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {career.category}
              </span>
            )}
          </div>
        </div>
        {!compact && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {career.educationLevel && (
              <span className="inline-flex items-center gap-1"><GraduationCap size={13} />{career.educationLevel}</span>
            )}
            {career.salaryMin != null && career.salaryMax != null && (
              <span>{(career.salaryMin / 1000).toFixed(0)}k - {(career.salaryMax / 1000).toFixed(0)}k &euro;</span>
            )}
            {futureScore != null && (
              <span className="inline-flex items-center gap-1" style={{ color: futureColor }}>
                <TrendingUp size={13} />{futureScore}/100
              </span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}
