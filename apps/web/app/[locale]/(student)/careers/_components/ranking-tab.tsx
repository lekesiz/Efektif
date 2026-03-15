"use client";

import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronUp, ChevronDown, Save, ListOrdered } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import type { CareerSummary, Locale } from "@efektif/shared";

type Status = "exploring" | "committed" | "rejected";
const STATUS_COLORS: Record<Status, string> = {
  exploring: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  committed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface RankedCareer {
  career: CareerSummary;
  notes: string;
  status: Status;
}

function getCareerName(career: CareerSummary, locale: string): string {
  if (locale === "tr" && career.nameTr) return career.nameTr;
  if (locale === "en" && career.nameEn) return career.nameEn;
  return career.nameFr;
}

export function RankingTab() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data: priorities } = trpc.priorities.list.useQuery();
  const { data: allCareers } = trpc.careers.list.useQuery({ limit: 100, offset: 0 });
  const setPriorities = trpc.priorities.set.useMutation();
  const utils = trpc.useUtils();

  const careerMap = new Map((allCareers ?? []).map((c) => [c.id, c]));

  const [items, setItems] = useState<RankedCareer[]>(() =>
    (priorities ?? [])
      .sort((a, b) => a.rank - b.rank)
      .map((p) => ({
        career: careerMap.get(p.careerId)!,
        notes: "",
        status: "exploring" as Status,
      }))
      .filter((item) => item.career != null),
  );

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1]!, next[index]!] = [next[index]!, next[index - 1]!];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setItems((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index]!, next[index + 1]!] = [next[index + 1]!, next[index]!];
      return next;
    });
  }, []);

  const updateNote = useCallback((index: number, notes: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, notes } : item)));
  }, []);

  const toggleStatus = useCallback((index: number) => {
    const order: Status[] = ["exploring", "committed", "rejected"];
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const next = order[(order.indexOf(item.status) + 1) % order.length]!;
        return { ...item, status: next };
      }),
    );
  }, []);

  function handleSubmit() {
    const payload = items.map((item, i) => ({
      careerId: item.career.id,
      rank: i + 1,
    }));
    setPriorities.mutate({ items: payload }, { onSuccess: () => utils.priorities.list.invalidate() });
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <ListOrdered size={40} className="mb-3 text-gray-300" />
        <p className="text-gray-500 dark:text-gray-400">{t("careers.noPriorities")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.career.id} className="flex items-start gap-3 rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                {getCareerName(item.career, locale)}
              </h3>
              <button
                onClick={() => toggleStatus(index)}
                className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", STATUS_COLORS[item.status])}
              >
                {t(`careers.status.${item.status}`)}
              </button>
            </div>
            <input
              type="text"
              value={item.notes}
              onChange={(e) => updateNote(index, e.target.value)}
              placeholder={t("careers.notesPlaceholder")}
              className="w-full rounded-md border bg-transparent px-2 py-1 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div className="flex shrink-0 flex-col gap-0.5">
            <button onClick={() => moveUp(index)} disabled={index === 0} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 dark:hover:text-gray-200">
              <ChevronUp size={16} />
            </button>
            <button onClick={() => moveDown(index)} disabled={index === items.length - 1} className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 dark:hover:text-gray-200">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          disabled={setPriorities.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={15} />
          {t("careers.submitChoices")}
        </button>
      </div>
    </div>
  );
}
