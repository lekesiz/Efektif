"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import { Search, Users, Activity, CheckCircle2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  accessLevel: string;
  testsCompleted: number;
  lastLoginAt: string | null;
}

export default function ClientsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.counselor.listClients.useQuery();

  const clients: Client[] = data?.clients ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => c.lastLoginAt).length;
    const completed = clients.filter((c) => c.testsCompleted >= 3).length;
    return { total, active, completed };
  }, [clients]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">{t("counselor.clients")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Users size={20} />} label={t("counselor.totalClients")} value={stats.total} color="blue" />
        <StatCard icon={<Activity size={20} />} label={t("counselor.activeClients")} value={stats.active} color="green" />
        <StatCard icon={<CheckCircle2 size={20} />} label={t("counselor.completedTests")} value={stats.completed} color="purple" />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("counselor.searchClients")}
          className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.name")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("common.email")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("counselor.testProgress")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("counselor.accessLevel")}</th>
              <th className="px-4 py-3 font-medium dark:text-gray-300">{t("counselor.lastLogin")}</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filtered.map((client) => (
              <tr key={client.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <Link href={`/clients/${client.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {client.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{client.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {client.testsCompleted}/3
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AccessBadge level={client.accessLevel} />
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t("counselor.noClients")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={`rounded-lg p-2.5 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function AccessBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    free: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    standard: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    premium: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[level] ?? styles.free}`}>
      {level}
    </span>
  );
}
