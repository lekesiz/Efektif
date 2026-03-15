"use client";

import { useTranslations } from "next-intl";
import { Heart, Compass } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import { CareerCard } from "./career-card";

export function FavoritesTab() {
  const t = useTranslations();
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();
  const { data: allCareers } = trpc.careers.list.useQuery({ limit: 100, offset: 0 });
  const removeFav = trpc.favorites.remove.useMutation();
  const utils = trpc.useUtils();

  const careerMap = new Map((allCareers ?? []).map((c) => [c.id, c]));
  const favCareers = (favorites ?? [])
    .map((f) => careerMap.get(f.careerId))
    .filter(Boolean);

  function handleRemove(careerId: string) {
    removeFav.mutate({ careerId }, { onSuccess: () => utils.favorites.list.invalidate() });
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (!favCareers.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Heart size={40} className="mb-3 text-gray-300" />
        <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">{t("careers.noFavorites")}</p>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t("careers.noFavoritesCta")}</p>
        <Link
          href="/careers?tab=explore"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Compass size={15} />
          {t("careers.explore")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favCareers.map((career) => (
        <CareerCard
          key={career!.id}
          career={career!}
          isFavorite
          onToggleFavorite={handleRemove}
        />
      ))}
    </div>
  );
}
