"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "@/lib/i18n/routing";
import { RIASEC_QUESTIONS, calculateRiasecScores } from "@efektif/shared/questions";
import { LikertScale } from "@/components/forms/likert-scale";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type { Locale } from "@efektif/shared/constants";

function useAutoSaveDraft(
  testType: "riasec",
  answers: Record<string, number>,
  currentIndex: number,
) {
  const saveDraft = trpc.tests.saveDraft.useMutation();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback(() => {
    if (Object.keys(answers).length === 0) return;
    saveDraft.mutate({ testType, answers, currentIndex });
  }, [testType, answers, currentIndex, saveDraft]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [answers, currentIndex, save]);
}

export default function RiasecTestPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const { data: draft, isLoading: draftLoading } = trpc.tests.loadDraft.useQuery(
    { testType: "riasec" },
    { enabled: !draftLoaded },
  );
  const submitTest = trpc.tests.submit.useMutation();

  // Restore draft on mount
  useEffect(() => {
    if (draft && !draftLoaded) {
      setAnswers(draft.answers);
      setCurrentIndex(draft.currentIndex);
      setDraftLoaded(true);
    } else if (!draftLoading && !draft) {
      setDraftLoaded(true);
    }
  }, [draft, draftLoading, draftLoaded]);

  // Auto-save
  useAutoSaveDraft("riasec", answers, currentIndex);

  const questions = RIASEC_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const progressPercent = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  const questionText = useMemo(() => {
    if (!currentQuestion) return "";
    switch (locale) {
      case "tr": return currentQuestion.textTr;
      case "en": return currentQuestion.textEn;
      default: return currentQuestion.textFr;
    }
  }, [currentQuestion, locale]);

  const likertLabels = useMemo((): [string, string, string, string, string] => {
    switch (locale) {
      case "tr":
        return ["Hic", "Az", "Orta", "Cok", "Tam"];
      case "en":
        return ["Not at all", "A little", "Moderate", "A lot", "Completely"];
      default:
        return ["Pas du tout", "Un peu", "Moyen", "Beaucoup", "Tout a fait"];
    }
  }, [locale]);

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      // Auto-advance after a short delay
      if (!isLastQuestion) {
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
      }
    },
    [currentQuestion, isLastQuestion],
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  }, [totalQuestions]);

  const handleSubmit = useCallback(async () => {
    if (!allAnswered || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const scores = calculateRiasecScores(answers);
      await submitTest.mutateAsync({
        testType: "riasec",
        scores,
      });
      router.push("/results?test=riasec");
    } catch {
      setIsSubmitting(false);
    }
  }, [allAnswered, isSubmitting, answers, submitTest, router]);

  // Show loading while restoring draft
  if (!draftLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("tests.riasec.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("tests.riasec.instruction")}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {t("tests.question")} {currentIndex + 1} / {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-8 text-center text-lg font-medium text-gray-900 dark:text-white">
          {questionText}
        </p>

        <LikertScale
          value={answers[currentQuestion.id] ?? null}
          onChange={handleAnswer}
          labels={likertLabels}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={16} />
          {t("tests.prev")}
        </button>

        {isLastQuestion && allAnswered ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {t("tests.submit")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastQuestion}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("tests.next")}
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Question dots / mini-map */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = answers[q.id] != null;
          const isCurrent = i === currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-3 w-3 rounded-full transition-all ${
                isCurrent
                  ? "scale-125 ring-2 ring-blue-400 ring-offset-1 bg-blue-500"
                  : isAnswered
                    ? "bg-green-400 dark:bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`${t("tests.question")} ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
