import { describe, it, expect } from "vitest";
import { VALUES_QUESTIONS, calculateValuesScores } from "../values";

describe("VALUES_QUESTIONS", () => {
  it("should have exactly 30 questions", () => {
    expect(VALUES_QUESTIONS).toHaveLength(30);
  });

  it("should have 5 questions per dimension", () => {
    const dimensions = [
      "achievement",
      "independence",
      "recognition",
      "relationships",
      "support",
      "working_conditions",
    ] as const;
    for (const dim of dimensions) {
      const count = VALUES_QUESTIONS.filter((q) => q.dimension === dim).length;
      expect(count, `Expected 5 questions for dimension ${dim}`).toBe(5);
    }
  });

  it("should have unique question ids", () => {
    const ids = VALUES_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("calculateValuesScores", () => {
  it("should return scores for all 6 dimensions", () => {
    const answers: Record<string, number> = {};
    for (const q of VALUES_QUESTIONS) {
      answers[q.id] = 4;
    }
    const scores = calculateValuesScores(answers);
    expect(Object.keys(scores)).toHaveLength(6);
    expect(Object.keys(scores)).toEqual(
      expect.arrayContaining([
        "achievement",
        "independence",
        "recognition",
        "relationships",
        "support",
        "working_conditions",
      ]),
    );
  });

  it("should return scores between 0 and 100", () => {
    const answers: Record<string, number> = {};
    for (const q of VALUES_QUESTIONS) {
      answers[q.id] = Math.ceil(Math.random() * 5);
    }
    const scores = calculateValuesScores(answers);
    for (const val of Object.values(scores)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });
});
