"use client";

import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { Users, GraduationCap, UserCheck, Brain } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#6b7280", "#eab308", "#10b981"];

export default function AdminStatsPage() {
  const t = useTranslations();
  const { data, isLoading } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const stats = data?.stats ?? { totalUsers: 0, totalStudents: 0, totalCounselors: 0, totalTestsCompleted: 0 };
  const accessDistribution = data?.accessDistribution ?? [
    { name: "Free", value: 0 },
    { name: "Standard", value: 0 },
    { name: "Premium", value: 0 },
  ];
  const testCompletionRates = data?.testCompletionRates ?? [
    { name: "RIASEC", completed: 0, total: 0 },
    { name: "Big Five", completed: 0, total: 0 },
    { name: "Values", completed: 0, total: 0 },
  ];
  const recentActivity = data?.recentActivity ?? [];

  const overviewCards = [
    { label: t("admin.totalUsers"), value: stats.totalUsers, icon: <Users size={20} />, color: "blue" },
    { label: t("admin.totalStudents"), value: stats.totalStudents, icon: <GraduationCap size={20} />, color: "green" },
    { label: t("admin.totalCounselors"), value: stats.totalCounselors, icon: <UserCheck size={20} />, color: "purple" },
    { label: t("admin.totalTests"), value: stats.totalTestsCompleted, icon: <Brain size={20} />, color: "orange" },
  ];

  const cardColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">{t("admin.statsDashboard")}</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className={`rounded-lg p-2.5 ${cardColors[card.color]}`}>{card.icon}</div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Access Level Distribution */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">{t("admin.accessDistribution")}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={accessDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {accessDistribution.map((_: unknown, i: number) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Test Completion Rates */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold dark:text-white">{t("admin.testCompletionRates")}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={testCompletionRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#3b82f6" name={t("admin.completed")} />
              <Bar dataKey="total" fill="#e5e7eb" name={t("admin.total")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold dark:text-white">{t("admin.recentActivity")}</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity: { id: string; message: string; createdAt: string }, i: number) => (
              <div key={activity.id ?? i} className="flex items-start gap-3 border-b pb-3 last:border-0 dark:border-gray-700">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-400">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("admin.noActivity")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
