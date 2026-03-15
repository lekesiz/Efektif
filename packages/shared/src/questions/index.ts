// ─── Questions Index ─────────────────────────────────────────
// Re-exports all question banks and provides unified helpers

export { RIASEC_QUESTIONS, calculateRiasecScores } from "./riasec";
export type { RiasecQuestion } from "./riasec";

export { BIGFIVE_QUESTIONS, calculateBigfiveScores } from "./bigfive";
export type { BigfiveQuestion } from "./bigfive";

export { VALUES_QUESTIONS, calculateValuesScores } from "./values";
export type { ValuesQuestion, ValuesDimension } from "./values";

import type { TestType } from "../constants";
import { RIASEC_QUESTIONS } from "./riasec";
import { BIGFIVE_QUESTIONS } from "./bigfive";
import { VALUES_QUESTIONS } from "./values";
import { calculateRiasecScores } from "./riasec";
import { calculateBigfiveScores } from "./bigfive";
import { calculateValuesScores } from "./values";

export interface BaseQuestion {
  id: string;
  dimension: string;
  textFr: string;
  textTr: string;
  textEn: string;
  reverse?: boolean;
}

/**
 * Get questions for a given test type.
 */
export function getQuestions(testType: TestType): BaseQuestion[] {
  switch (testType) {
    case "riasec":
      return RIASEC_QUESTIONS;
    case "bigfive":
      return BIGFIVE_QUESTIONS;
    case "values":
      return VALUES_QUESTIONS.map((q) => ({ ...q, reverse: undefined }));
  }
}

/**
 * Calculate scores for a given test type from raw answers.
 */
export function calculateScores(
  testType: TestType,
  answers: Record<string, number>,
): Record<string, number> {
  switch (testType) {
    case "riasec":
      return calculateRiasecScores(answers);
    case "bigfive":
      return calculateBigfiveScores(answers);
    case "values":
      return calculateValuesScores(answers);
  }
}
