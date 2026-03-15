"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { Calendar, Clock, MessageSquare, Filter } from "lucide-react";

type AppointmentStatus = "pending" | "contacted" | "completed" | "cancelled";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  contacted: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AppointmentsPage() {
  const t = useTranslations();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");

  const { data, isLoading, refetch } = trpc.counselor.listAppointments.useQuery();
  const updateStatus = trpc.counselor.updateAppointmentStatus.useMutation({ onSuccess: () => void refetch() });
  const saveNotes = trpc.counselor.saveAppointmentNotes.useMutation({ onSuccess: () => { setEditingNotes(null); void refetch(); } });

  const appointments = data?.appointments ?? [];
  const filtered = statusFilter === "all" ? appointments : appointments.filter((a: { status: string }) => a.status === statusFilter);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">{t("counselor.appointments")}</h1>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "all")}
          className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">{t("common.all")}</option>
          <option value="pending">{t("counselor.pending")}</option>
          <option value="contacted">{t("counselor.contacted")}</option>
          <option value="completed">{t("counselor.completed")}</option>
          <option value="cancelled">{t("counselor.cancelled")}</option>
        </select>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filtered.map((appt: { id: string; studentName: string; reason: string; preferredDate: string; status: AppointmentStatus; notes: string | null }) => (
          <div key={appt.id} className="rounded-lg border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold dark:text-white">{appt.studentName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{appt.reason}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(appt.preferredDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(appt.preferredDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[appt.status]}`}>
                  {appt.status}
                </span>
                <select
                  value={appt.status}
                  onChange={(e) => updateStatus.mutate({ appointmentId: appt.id, status: e.target.value as AppointmentStatus })}
                  className="rounded border bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                >
                  <option value="pending">{t("counselor.pending")}</option>
                  <option value="contacted">{t("counselor.contacted")}</option>
                  <option value="completed">{t("counselor.completed")}</option>
                  <option value="cancelled">{t("counselor.cancelled")}</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-3 border-t pt-3 dark:border-gray-700">
              {editingNotes === appt.id ? (
                <div className="space-y-2">
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveNotes.mutate({ appointmentId: appt.id, notes: notesText })} disabled={saveNotes.isPending} className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50">{t("common.save")}</button>
                    <button onClick={() => setEditingNotes(null)} className="rounded border px-3 py-1 text-xs dark:border-gray-600 dark:text-gray-300">{t("common.cancel")}</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingNotes(appt.id); setNotesText(appt.notes ?? ""); }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  <MessageSquare size={14} /> {appt.notes ? t("counselor.editNotes") : t("counselor.addNotes")}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t("counselor.noAppointments")}</div>
        )}
      </div>
    </div>
  );
}
