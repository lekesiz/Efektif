"use client";

import { VALUES_META, getDimensionLabel, getDimensionColor } from "@efektif/shared/psychometric";
import type { Locale } from "@efektif/shared/constants";

interface ValuesRankingProps {
  scores: Record<string, number>;
  locale?: Locale;
}

export function ValuesRanking({ scores, locale = "fr" }: ValuesRankingProps) {
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-3">
      {sorted.map(([dim, score], index) => {
        const label = getDimensionLabel(VALUES_META, dim, locale);
        const color = getDimensionColor(VALUES_META, dim);

        return (
          <div key={dim} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{score}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
