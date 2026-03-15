"use client";

import { BIGFIVE_META, getDimensionLabel, getDimensionColor } from "@efektif/shared/psychometric";
import { BIGFIVE_DIMENSIONS } from "@efektif/shared/constants";
import type { Locale } from "@efektif/shared/constants";

interface BigFiveBarsProps {
  scores: Record<string, number>;
  locale?: Locale;
}

export function BigFiveBars({ scores, locale = "fr" }: BigFiveBarsProps) {
  const sorted = [...BIGFIVE_DIMENSIONS].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0),
  );

  return (
    <div className="space-y-4">
      {sorted.map((dim) => {
        const score = scores[dim] ?? 0;
        const label = getDimensionLabel(BIGFIVE_META, dim, locale);
        const color = getDimensionColor(BIGFIVE_META, dim);

        return (
          <div key={dim} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{score}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
