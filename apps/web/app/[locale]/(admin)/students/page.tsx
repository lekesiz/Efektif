"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowUpCircle } from "lucide-react";

const PAGE_SIZE = 20;

export default function AdminStudentsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data, isLoading, refetch } = trpc.admin.listStudents.useQuery({ page, pageSize: PAGE_SIZE });
  const bulkUpgrade = trpc.admin.bulkUpgradeAccess.useMutation({ onSuccess: () => { setSelected(new Set()); void refetch(); } });
  const bulkDelete = trpc.admin.bulkDeleteUsers.useMutation({ onSuccess: () => { setSelected(new Set()); void refetch(); } });

  const students = data?.students ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filtered = useMemo(() => {
    let list = students;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s: { name: string; email: string }) =>
          s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
      );
    }
    if (roleFilter !== "all") {
      list = list.filter((s: { role: string }) => s.role === roleFilter);
    }
    return list;
  }, [students, search, roleFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s: { id: string }) => s.id)));
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">{t("admin.studentManagement")}</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.searchUsers")}
            className="w-full max-w-md rounded-lg border bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">{t("admin.allRoles")}</option>
          <option value="student">{t("admin.student")}</option>
          <option value="counselor">{t("admin.counselor")}</option>
          <option value="admin">{t("admin.admin")}</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            {selected.size} {t("admin.selected")}
          </span>
          <button
            onClick={() => bulkUpgrade.mutate({ userIds: Array.from(selected), accessLevel: "standard" })}
            disabled={bulkUpgrade.isPending}
            className="inline-flex items-center gap-1 rounded bg-yellow-500 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            <ArrowUpCircle size={14} /> {t("admin.upgradeStandard")}
          </button>
          <button
            onClick={() => bulkUpgrade.mutate({ userIds: Array.from(selected), accessLevel: "premium" })}
            disabled={bulkUpgrade.isPending}
            className="inline-flex items-center gap-1 rounded bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            <ArrowUpCircle size={14} /> {t("admin.upgradePremium")}
          </button>
          <button
            onClick={() => { if (confirm(t("admin.confirmDelete"))) bulkDelete.mutate({ userIds: Array.from(selected) }); }}
            disabled={bulkDelete.isPending}
            className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 size={14} /> {t("admin.delete")}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.name")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.email")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.role")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.accessLevel")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.testsCompleted")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.counselor")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("admin.createdDate")}</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filtered.map((s: { id: string; name: string; email: string; role: string; accessLevel: string; testsCompleted: number; counselorName: string | null; createdAt: string }) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded" />
                </td>
                <td className="px-4 py-3 font-medium dark:text-white">{s.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.email}</td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{s.role}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize dark:bg-gray-700 dark:text-gray-300">
                    {s.accessLevel}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.testsCompleted}/3</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.counselorName ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("admin.page")} {page + 1} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
