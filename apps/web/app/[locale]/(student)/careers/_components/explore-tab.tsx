"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { CareerCard } from "./career-card";

const PAGE_SIZE = 12;

export function ExploreTab() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);

  const { data: categories } = trpc.careers.categories.useQuery();
  const { data: careers, isLoading } = trpc.careers.list.useQuery({
    search: search || undefined,
    category: category || undefined,
    limit: PAGE_SIZE,
    offset,
  });
  const { data: total } = trpc.careers.count.useQuery({
    search: search || undefined,
    category: category || undefined,
  });
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

  function handleSearch(value: string) {
    setSearch(value);
    setOffset(0);
  }

  function handleCategory(value: string) {
    setCategory(value);
    setOffset(0);
  }

  const hasMore = (total ?? 0) > offset + PAGE_SIZE;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("careers.searchPlaceholder")}
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
            className="appearance-none rounded-lg border bg-white py-2 pl-8 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t("careers.allCategories")}</option>
            {(categories ?? []).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-blue-500" />
        </div>
      ) : !careers?.length ? (
        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("careers.noResults")}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                isFavorite={favoriteIds.has(career.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
                className="rounded-lg border px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("careers.loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
