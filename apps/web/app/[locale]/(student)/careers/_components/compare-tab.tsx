"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GitCompareArrows, X } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { RIASEC_META, getDimensionLabel, calculateFutureScore } from "@efektif/shared";
import type { CareerSummary, Locale } from "@efektif/shared";

const RIASEC_KEYS = ["R", "I", "A", "S", "E", "C"] as const;
const BAR_COLORS = ["bg-blue-500", "bg-purple-500", "bg-rose-500"];

function getCareerName(c: CareerSummary, locale: string): string {
  if (locale === "tr" && c.nameTr) return c.nameTr;
  if (locale === "en" && c.nameEn) return c.nameEn;
  return c.nameFr;
}

export function CompareTab() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: allCareers } = trpc.careers.list.useQuery({ limit: 100, offset: 0 });

  const careers = (allCareers ?? []);
  const selected = selectedIds.map((id) => careers.find((c) => c.id === id)).filter(Boolean) as CareerSummary[];

  function addCareer(id: string) {
    if (selectedIds.length >= 3 || selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
  }

  function removeCareer(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          onChange={(e) => { if (e.target.value) addCareer(e.target.value); e.target.value = ""; }}
          className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={selectedIds.length >= 3}
        >
          <option value="">{t("careers.selectToCompare")}</option>
          {careers.filter((c) => !selectedIds.includes(c.id)).map((c) => (
            <option key={c.id} value={c.id}>{getCareerName(c, locale)}</option>
          ))}
        </select>
        {selected.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {getCareerName(c, locale)}
            <button onClick={() => removeCareer(c.id)} className="hover:text-blue-600"><X size={12} /></button>
          </span>
        ))}
      </div>

      {selected.length < 2 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <GitCompareArrows size={40} className="mb-3 text-gray-300" />
          <p className="text-gray-500 dark:text-gray-400">{t("careers.selectAtLeastTwo")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-2 pr-4 text-gray-500 dark:text-gray-400">{t("careers.criterion")}</th>
                {selected.map((c, i) => (
                  <th key={c.id} className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    <span className={`inline-block h-2 w-2 rounded-full ${BAR_COLORS[i]} mr-1.5`} />
                    {getCareerName(c, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              <tr>
                <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{t("careers.education")}</td>
                {selected.map((c) => (
                  <td key={c.id} className="px-3 py-2.5 text-gray-900 dark:text-white">{c.educationLevel ?? "-"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{t("careers.salary")}</td>
                {selected.map((c) => (
                  <td key={c.id} className="px-3 py-2.5 text-gray-900 dark:text-white">
                    {c.salaryMin != null && c.salaryMax != null ? `${(c.salaryMin / 1000).toFixed(0)}k - ${(c.salaryMax / 1000).toFixed(0)}k` : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{t("careers.aiImpact")}</td>
                {selected.map((c, i) => (
                  <td key={c.id} className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className={`h-2 rounded-full ${BAR_COLORS[i]}`} style={{ width: `${c.aiImpactScore ?? 0}%` }} />
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{c.aiImpactScore ?? 0}%</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{t("careers.futureScore")}</td>
                {selected.map((c, i) => {
                  const fs = calculateFutureScore({ aiImpactScore: c.aiImpactScore ?? undefined, salaryMedian: c.salaryMin ?? undefined }, locale);
                  return (
                    <td key={c.id} className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className={`h-2 rounded-full ${BAR_COLORS[i]}`} style={{ width: `${fs.score}%` }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: fs.color }}>{fs.score}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
              {RIASEC_KEYS.map((dim) => (
                <tr key={dim}>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{getDimensionLabel(RIASEC_META, dim, locale)}</td>
                  {selected.map((c, i) => (
                    <td key={c.id} className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className={`h-2 rounded-full ${BAR_COLORS[i]}`} style={{ width: "50%" }} />
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">-</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
