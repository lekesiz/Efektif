"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as Tabs from "@radix-ui/react-tabs";
import { Sparkles, Heart, GitCompareArrows, ListOrdered, Compass } from "lucide-react";
import { useRouter } from "@/lib/i18n/routing";
import { RecommendationsTab } from "./_components/recommendations-tab";
import { FavoritesTab } from "./_components/favorites-tab";
import { CompareTab } from "./_components/compare-tab";
import { RankingTab } from "./_components/ranking-tab";
import { ExploreTab } from "./_components/explore-tab";

const TAB_ITEMS = [
  { value: "recommendations", icon: Sparkles },
  { value: "favorites", icon: Heart },
  { value: "compare", icon: GitCompareArrows },
  { value: "ranking", icon: ListOrdered },
  { value: "explore", icon: Compass },
] as const;

export default function CareersPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "recommendations";

  function handleTabChange(value: string) {
    router.replace(`/careers?tab=${value}`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("careers.title")}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{t("careers.subtitle")}</p>
      </div>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List className="flex gap-1 overflow-x-auto border-b pb-px dark:border-gray-700">
          {TAB_ITEMS.map(({ value, icon: Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="inline-flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:text-blue-400"
            >
              <Icon size={15} />
              {t(`careers.tabs.${value}`)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="pt-4">
          <Tabs.Content value="recommendations"><RecommendationsTab /></Tabs.Content>
          <Tabs.Content value="favorites"><FavoritesTab /></Tabs.Content>
          <Tabs.Content value="compare"><CompareTab /></Tabs.Content>
          <Tabs.Content value="ranking"><RankingTab /></Tabs.Content>
          <Tabs.Content value="explore"><ExploreTab /></Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
