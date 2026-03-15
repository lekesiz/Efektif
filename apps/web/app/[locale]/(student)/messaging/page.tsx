"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, MessageSquare, User, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { MESSAGE_POLL_INTERVAL_MS } from "@efektif/shared";

export default function MessagingPage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads, isLoading: threadsLoading } = trpc.messaging.threads.useQuery(undefined, {
    refetchInterval: MESSAGE_POLL_INTERVAL_MS,
  });
  const { data: messages, isLoading: messagesLoading } = trpc.messaging.messages.useQuery(
    { threadId: activeThreadId! },
    { enabled: !!activeThreadId, refetchInterval: MESSAGE_POLL_INTERVAL_MS },
  );
  const sendMessage = trpc.messaging.send.useMutation();
  const utils = trpc.useUtils();

  const activeThread = threads?.find((th) => th.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (threads?.length && !activeThreadId) {
      setActiveThreadId(threads[0]!.id);
    }
  }, [threads, activeThreadId]);

  function handleSend() {
    if (!input.trim() || !activeThreadId) return;
    sendMessage.mutate(
      { threadId: activeThreadId, content: input.trim() },
      {
        onSuccess: () => {
          setInput("");
          utils.messaging.messages.invalidate({ threadId: activeThreadId });
          utils.messaging.threads.invalidate();
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }

  if (threadsLoading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-blue-500" /></div>;

  if (!threads?.length) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t("messaging.title")}</h1>
        <div className="flex flex-col items-center rounded-xl border bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
          <MessageSquare size={40} className="mb-3 text-gray-300" />
          <p className="font-medium text-gray-700 dark:text-gray-300">{t("messaging.noConversations")}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("messaging.noConversationsCta")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{t("messaging.title")}</h1>
      <div className="flex h-[calc(100vh-220px)] min-h-[400px] overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Sidebar */}
        <div className="w-72 shrink-0 border-r dark:border-gray-700">
          <div className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("messaging.conversations")}</p>
          </div>
          <ul className="space-y-0.5 px-2">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => setActiveThreadId(thread.id)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                    activeThreadId === thread.id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                    <User size={16} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{thread.participantName}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{thread.lastMessage}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat panel */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b px-4 py-3 dark:border-gray-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <User size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">{activeThread?.participantName}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3">
                {(messages ?? []).map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                          isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white",
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className={cn("mt-1 text-[10px]", isOwn ? "text-blue-200" : "text-gray-400")}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3 dark:border-gray-700">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("messaging.placeholder")}
                rows={1}
                className="flex-1 resize-none rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sendMessage.isPending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
