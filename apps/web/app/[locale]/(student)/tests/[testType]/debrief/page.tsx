"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/lib/i18n/routing";
import { MAX_DEBRIEF_MESSAGES } from "@efektif/shared";
import type { TestType } from "@efektif/shared";
import { ChatMessage } from "@/components/ui/chat-message";
import { Send, CheckCircle2, ArrowLeft, MessageSquare } from "lucide-react";

export default function DebriefPage() {
  const t = useTranslations();
  const params = useParams<{ locale: string; testType: string }>();
  const testType = params.testType as TestType;
  const locale = params.locale as "fr" | "tr" | "en";
  const user = useAuthStore((s) => s.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: testResults } = trpc.tests.results.useQuery();
  const currentResult = testResults?.find((r) => r.testType === testType);
  const scores = currentResult?.scores ?? {};

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } =
    useChat({
      api: "/api/ai/chat",
      body: {
        testType,
        scores,
        locale,
        studentName: user?.name ?? "Student",
        schoolLevel: null,
        birthDate: null,
      },
    });

  // Fetch opening message on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current || !currentResult || Object.keys(scores).length === 0) return;
    hasFetched.current = true;
    // Trigger opening by sending an empty user-facing request
    append({
      role: "user",
      content:
        locale === "fr"
          ? "Bonjour, je viens de terminer mon test. Pouvez-vous analyser mes résultats ?"
          : locale === "tr"
            ? "Merhaba, testimi yeni tamamladım. Sonuçlarımı analiz edebilir misiniz?"
            : "Hello, I just finished my test. Can you analyze my results?",
    });
  }, [currentResult, scores, locale, append]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const reachedLimit = userMessageCount >= MAX_DEBRIEF_MESSAGES;

  useEffect(() => {
    if (reachedLimit && !isLoading) {
      setIsCompleted(true);
    }
  }, [reachedLimit, isLoading]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const testLabels: Record<TestType, string> = {
    riasec: "RIASEC",
    bigfive: "Big Five",
    values: t("tests.values.title"),
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Link
            href={`/results?test=${testType}`}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("debrief.title")} - {testLabels[testType]}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageSquare size={14} />
              <span>
                {userMessageCount}/{MAX_DEBRIEF_MESSAGES} {t("debrief.exchanges")}
              </span>
            </div>
          </div>
        </div>
        {!isCompleted && userMessageCount >= 2 && (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <CheckCircle2 size={16} />
            {t("debrief.complete")}
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={message.content}
            createdAt={message.createdAt}
            isLoading={false}
          />
        ))}
        {isLoading && (
          <ChatMessage role="assistant" content="" isLoading={true} />
        )}
        {isCompleted && (
          <div className="mx-auto max-w-md rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {t("debrief.completed")}
            </p>
            <Link
              href="/results"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("debrief.viewResults")}
            </Link>
          </div>
        )}
      </div>

      {/* Input */}
      {!isCompleted && !reachedLimit && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder={t("debrief.inputPlaceholder")}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      )}

      {/* Progress bar */}
      <div className="mt-2 pb-2">
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(userMessageCount / MAX_DEBRIEF_MESSAGES) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
