import { describe, it, expect } from "vitest";
import { RIASEC_QUESTIONS, calculateRiasecScores } from "../riasec";

describe("RIASEC_QUESTIONS", () => {
  it("should have exactly 30 questions", () => {
    expect(RIASEC_QUESTIONS).toHaveLength(30);
  });

  it("should have 5 questions per dimension", () => {
    const dimensions = ["R", "I", "A", "S", "E", "C"] as const;
    for (const dim of dimensions) {
      const count = RIASEC_QUESTIONS.filter((q) => q.dimension === dim).length;
      expect(count, `Expected 5 questions for dimension ${dim}`).toBe(5);
    }
  });

  it("should have unique question ids", () => {
    const ids = RIASEC_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have all text fields populated", () => {
    for (const q of RIASEC_QUESTIONS) {
      expect(q.textFr.length).toBeGreaterThan(0);
      expect(q.textTr.length).toBeGreaterThan(0);
      expect(q.textEn.length).toBeGreaterThan(0);
    }
  });
});

describe("calculateRiasecScores", () => {
  it("should return scores for all 6 dimensions", () => {
    const answers: Record<string, number> = {};
    for (const q of RIASEC_QUESTIONS) {
      answers[q.id] = 3;
    }
    const scores = calculateRiasecScores(answers);
    expect(Object.keys(scores)).toEqual(
      expect.arrayContaining(["R", "I", "A", "S", "E", "C"]),
    );
    expect(Object.keys(scores)).toHaveLength(6);
  });

  it("should return scores between 0 and 100", () => {
    const answers: Record<string, number> = {};
    for (const q of RIASEC_QUESTIONS) {
      answers[q.id] = 3;
    }
    const scores = calculateRiasecScores(answers);
    for (const val of Object.values(scores)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });

  it("should return near 100 when all answers are max (5)", () => {
    const answers: Record<string, number> = {};
    for (const q of RIASEC_QUESTIONS) {
      answers[q.id] = 5;
    }
    const scores = calculateRiasecScores(answers);
    for (const val of Object.values(scores)) {
      expect(val).toBe(100);
    }
  });

  it("should return near 0 when all answers are min (1)", () => {
    const answers: Record<string, number> = {};
    for (const q of RIASEC_QUESTIONS) {
      answers[q.id] = 1;
    }
    const scores = calculateRiasecScores(answers);
    for (const val of Object.values(scores)) {
      expect(val).toBe(20);
    }
  });
});
