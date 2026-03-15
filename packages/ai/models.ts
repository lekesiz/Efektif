// ─── AI Model Selection ─────────────────────────────────
// Route tasks to the right model based on complexity

import { AI_MODEL_FAST, AI_MODEL_REASONING } from "@efektif/shared";

export type TaskComplexity = "light" | "heavy";

const TASK_MODEL_MAP: Record<string, TaskComplexity> = {
  // Light tasks → Haiku (fast, cheap)
  debrief_opening: "light",
  debrief_continue: "light",
  career_enrichment: "light",
  formation_search: "light",
  insight_extraction: "light",

  // Heavy tasks → Sonnet (reasoning, quality)
  diagnostic_report: "heavy",
  admission_advice: "heavy",
  admission_draft: "heavy",
  career_reranking: "heavy",
  ai_impact_analysis: "heavy",
};

export function getModelForTask(taskType: string): string {
  const complexity = TASK_MODEL_MAP[taskType] ?? "light";
  return complexity === "heavy" ? AI_MODEL_REASONING : AI_MODEL_FAST;
}

export function getMaxTokensForTask(taskType: string): number {
  const complexity = TASK_MODEL_MAP[taskType] ?? "light";
  return complexity === "heavy" ? 8192 : 4096;
}
