"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { TEST_TYPES } from "@efektif/shared";
import { Brain, Fingerprint, Heart, FileText, Briefcase, Mail, RefreshCw, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/routing";

const TEST_ICONS: Record<string, React.ReactNode> = { riasec: <Brain size={18} />, bigfive: <Fingerprint size={18} />, values: <Heart size={18} /> };

export default function ClientDetailPage() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const { data, isLoading } = trpc.counselor.getClient.useQuery({ id: params.id });
  const inviteRetake = trpc.counselor.inviteRetake.useMutation();
  const generateDiagnostic = trpc.counselor.generateDiagnostic.useMutation();
  const sendMessage = trpc.counselor.sendMessage.useMutation();

  if (isLoading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  if (!data?.client) return <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t("counselor.clientNotFound")}</div>;

  const { client } = data;

  return (
    <div className="space-y-6">
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
        <ArrowLeft size={16} /> {t("common.back")}
      </Link>

      {/* Profile Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold dark:text-white">{client.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {client.accessLevel}
              </span>
              {client.profileType && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {client.profileType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Completion */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold dark:text-white">{t("counselor.testStatus")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEST_TYPES.map((testType) => {
            const result = client.testResults?.find((r: { testType: string }) => r.testType === testType);
            const debrief = client.debriefs?.find((d: { testType: string }) => d.testType === testType);
            return (
              <div key={testType} className="rounded-lg border p-4 dark:border-gray-600">
                <div className="mb-2 flex items-center gap-2">
                  {TEST_ICONS[testType]}
                  <span className="font-medium capitalize dark:text-white">{testType}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <StatusLine
                    label={t("counselor.test")}
                    done={!!result}
                    date={result?.completedAt}
                  />
                  <StatusLine
                    label={t("counselor.debrief")}
                    done={debrief?.isCompleted ?? false}
                    date={debrief?.completedAt}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic & Career Priorities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={18} />
            <h2 className="text-lg font-semibold dark:text-white">{t("counselor.diagnosticReport")}</h2>
          </div>
          {client.diagnosticReport ? (
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {client.diagnosticReport.status}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("counselor.generatedAt")}: {new Date(client.diagnosticReport.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("counselor.noDiagnostic")}</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <Briefcase size={18} />
            <h2 className="text-lg font-semibold dark:text-white">{t("counselor.careerPriorities")}</h2>
          </div>
          {client.careerPriorities?.length > 0 ? (
            <ol className="space-y-1 text-sm">
              {client.careerPriorities.map((cp: { rank: number; careerName: string }, i: number) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  {cp.rank}. {cp.careerName}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("counselor.noPriorities")}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => inviteRetake.mutate({ studentId: params.id })}
          disabled={inviteRetake.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={16} /> {t("counselor.inviteRetake")}
        </button>
        <button
          onClick={() => generateDiagnostic.mutate({ studentId: params.id })}
          disabled={generateDiagnostic.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <FileText size={16} /> {t("counselor.generateDiagnostic")}
        </button>
        <button
          onClick={() => sendMessage.mutate({ studentId: params.id, message: "" })}
          disabled={sendMessage.isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <Mail size={16} /> {t("counselor.sendMessage")}
        </button>
      </div>
    </div>
  );
}

function StatusLine({ label, done, date }: { label: string; done: boolean; date?: string }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={14} className="text-green-500" />
      ) : (
        <Clock size={14} className="text-gray-400" />
      )}
      <span className={done ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}>
        {label}
      </span>
      {done && date && (
        <span className="ml-auto text-xs text-gray-400">{new Date(date).toLocaleDateString()}</span>
      )}
    </div>
  );
}
