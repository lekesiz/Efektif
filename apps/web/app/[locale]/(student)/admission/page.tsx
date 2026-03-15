"use client";

import { useTranslations } from "next-intl";
import { Plus, FileText, Clock, CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { MAX_DOSSIERS_PER_STUDENT } from "@efektif/shared";
import { trpc } from "@/lib/trpc/client";

type DossierStatus = "draft" | "generating" | "validated" | "published";

interface Dossier { id: string; formationName: string; establishmentName: string; status: DossierStatus; updatedAt: Date }

const STATUS_CONFIG: Record<DossierStatus, { icon: React.ReactNode; color: string }> = {
  draft: { icon: <FileText size={14} />, color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  generating: { icon: <Loader2 size={14} className="animate-spin" />, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  validated: { icon: <CheckCircle2 size={14} />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  published: { icon: <Send size={14} />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function AdmissionPage() {
  const t = useTranslations();
  const { data: documents, isLoading } = trpc.documents.list.useQuery();

  const dossiers: Dossier[] = (documents ?? []).map((doc) => ({
    id: doc.id,
    formationName: doc.name,
    establishmentName: "-",
    status: "draft" as DossierStatus,
    updatedAt: doc.uploadedAt,
  }));

  const canCreate = dossiers.length < MAX_DOSSIERS_PER_STUDENT;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-blue-500" /></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("admission.title")}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">{t("admission.subtitle")}</p>
        </div>
        {canCreate && (
          <Link
            href="/admission/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus size={16} />
            {t("admission.createNew")}
          </Link>
        )}
      </div>

      {!canCreate && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertCircle size={16} />
          {t("admission.maxReached", { max: MAX_DOSSIERS_PER_STUDENT })}
        </div>
      )}

      {!dossiers.length ? (
        <div className="flex flex-col items-center rounded-xl border bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
          <FileText size={40} className="mb-3 text-gray-300" />
          <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">{t("admission.noDossiers")}</p>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t("admission.noDossiersCta")}</p>
          <Link
            href="/admission/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={15} />
            {t("admission.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {dossiers.map((dossier) => {
            const cfg = STATUS_CONFIG[dossier.status];
            return (
              <Link
                key={dossier.id}
                href={`/admission/${dossier.id}`}
                className="group rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {dossier.formationName}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                      {dossier.establishmentName}
                    </p>
                  </div>
                  <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cfg.color)}>
                    {cfg.icon}
                    {t(`admission.status.${dossier.status}`)}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} />
                  {new Date(dossier.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
