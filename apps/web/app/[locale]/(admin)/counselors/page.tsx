"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { UserPlus, ToggleLeft, ToggleRight, X } from "lucide-react";

export default function AdminCounselorsPage() {
  const t = useTranslations();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", maxClients: 20 });

  const { data, isLoading, refetch } = trpc.admin.listCounselors.useQuery();
  const createCounselor = trpc.admin.createCounselor.useMutation({ onSuccess: () => { setShowCreate(false); setForm({ name: "", email: "", maxClients: 20 }); void refetch(); } });
  const toggleStatus = trpc.admin.toggleCounselorStatus.useMutation({ onSuccess: () => void refetch() });

  const counselors = data?.counselors ?? [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">{t("admin.counselorManagement")}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <UserPlus size={16} /> {t("admin.createCounselor")}
        </button>
      </div>

      {/* Create Dialog */}
      {showCreate && (
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">{t("admin.newCounselor")}</h2>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text" placeholder={t("common.name")} value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <input
              type="email" placeholder={t("common.email")} value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <input
              type="number" placeholder={t("admin.maxClients")} value={form.maxClients}
              onChange={(e) => setForm((f) => ({ ...f, maxClients: Number(e.target.value) }))}
              className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => createCounselor.mutate(form)}
            disabled={createCounselor.isPending || !form.name || !form.email}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createCounselor.isPending ? t("common.saving") : t("common.create")}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.name")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.email")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.clientCount")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.maxClients")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.status")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {counselors.map((c: { id: string; name: string; email: string; clientCount: number; maxClients: number; isActive: boolean }) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium dark:text-white">{c.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.email}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.clientCount}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.maxClients}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.isActive ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {c.isActive ? t("admin.active") : t("admin.inactive")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus.mutate({ counselorId: c.id, isActive: !c.isActive })}
                    disabled={toggleStatus.isPending}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title={c.isActive ? t("admin.deactivate") : t("admin.activate")}
                  >
                    {c.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
                  </button>
                </td>
              </tr>
            ))}
            {counselors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t("admin.noCounselors")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
