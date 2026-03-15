"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { FileText, CheckCircle2, Send, Eye, Filter, MessageSquare } from "lucide-react";

type ReportStatus = "draft" | "validated" | "published";

const STATUS_STYLES: Record<ReportStatus, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  validated: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  published: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function ReportsPage() {
  const t = useTranslations();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [notesId, setNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");

  const { data, isLoading, refetch } = trpc.counselor.listReports.useQuery();
  const validateReport = trpc.counselor.validateReport.useMutation({ onSuccess: () => void refetch() });
  const publishReport = trpc.counselor.publishReport.useMutation({ onSuccess: () => void refetch() });
  const saveNotes = trpc.counselor.saveReportNotes.useMutation({ onSuccess: () => { setNotesId(null); void refetch(); } });

  const reports = data?.reports ?? [];
  const filtered = statusFilter === "all" ? reports : reports.filter((r: { status: string }) => r.status === statusFilter);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">{t("counselor.diagnosticReports")}</h1>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "all")}
          className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">{t("common.all")}</option>
          <option value="draft">{t("counselor.draft")}</option>
          <option value="validated">{t("counselor.validated")}</option>
          <option value="published">{t("counselor.published")}</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.map((report: { id: string; studentName: string; status: ReportStatus; content: string; advisorNotes: string | null; createdAt: string }) => (
          <div key={report.id} className="rounded-lg border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold dark:text-white">{report.studentName}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[report.status]}`}>
                  {report.status}
                </span>
                <button onClick={() => setViewingId(viewingId === report.id ? null : report.id)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" title={t("counselor.viewReport")}>
                  <Eye size={16} />
                </button>
                {report.status === "draft" && (
                  <button onClick={() => validateReport.mutate({ reportId: report.id })} disabled={validateReport.isPending} className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50">
                    <CheckCircle2 size={14} /> {t("counselor.validate")}
                  </button>
                )}
                {report.status === "validated" && (
                  <button onClick={() => publishReport.mutate({ reportId: report.id })} disabled={publishReport.isPending} className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50">
                    <Send size={14} /> {t("counselor.publish")}
                  </button>
                )}
              </div>
            </div>

            {/* Content Preview */}
            {viewingId === report.id && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                {report.content}
              </div>
            )}

            {/* Advisor Notes */}
            <div className="mt-3 border-t pt-3 dark:border-gray-700">
              {notesId === report.id ? (
                <div className="space-y-2">
                  <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                  <div className="flex gap-2">
                    <button onClick={() => saveNotes.mutate({ reportId: report.id, notes: notesText })} disabled={saveNotes.isPending} className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50">{t("common.save")}</button>
                    <button onClick={() => setNotesId(null)} className="rounded border px-3 py-1 text-xs dark:border-gray-600 dark:text-gray-300">{t("common.cancel")}</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setNotesId(report.id); setNotesText(report.advisorNotes ?? ""); }} className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
                  <MessageSquare size={14} /> {report.advisorNotes ? t("counselor.editNotes") : t("counselor.addNotes")}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t("counselor.noReports")}</div>
        )}
      </div>
    </div>
  );
}
