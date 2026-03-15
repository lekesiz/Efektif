import { describe, it, expect } from "vitest";
import { BIGFIVE_QUESTIONS, calculateBigfiveScores } from "../bigfive";

describe("BIGFIVE_QUESTIONS", () => {
  it("should have exactly 50 questions", () => {
    expect(BIGFIVE_QUESTIONS).toHaveLength(50);
  });

  it("should have 10 questions per dimension", () => {
    const dimensions = ["O", "C", "E", "A", "N"] as const;
    for (const dim of dimensions) {
      const count = BIGFIVE_QUESTIONS.filter((q) => q.dimension === dim).length;
      expect(count, `Expected 10 questions for dimension ${dim}`).toBe(10);
    }
  });

  it("should have some reverse-scored questions in each dimension", () => {
    const dimensions = ["O", "C", "E", "A", "N"] as const;
    for (const dim of dimensions) {
      const reverseCount = BIGFIVE_QUESTIONS.filter(
        (q) => q.dimension === dim && q.reverse,
      ).length;
      expect(
        reverseCount,
        `Expected at least 1 reverse question for ${dim}`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("calculateBigfiveScores", () => {
  it("should return scores for all 5 dimensions", () => {
    const answers: Record<string, number> = {};
    for (const q of BIGFIVE_QUESTIONS) {
      answers[q.id] = 3;
    }
    const scores = calculateBigfiveScores(answers);
    expect(Object.keys(scores)).toHaveLength(5);
    expect(Object.keys(scores)).toEqual(
      expect.arrayContaining(["O", "C", "E", "A", "N"]),
    );
  });

  it("should return scores between 0 and 100", () => {
    const answers: Record<string, number> = {};
    for (const q of BIGFIVE_QUESTIONS) {
      answers[q.id] = Math.ceil(Math.random() * 5);
    }
    const scores = calculateBigfiveScores(answers);
    for (const val of Object.values(scores)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });

  it("should apply reverse scoring correctly", () => {
    // Answer all 5 on a reverse question => effective value is 1 (6-5)
    // Answer all 5 on a normal question => effective value is 5
    // If all answers are 5 for dimension O:
    //   Normal questions (7) contribute 5 each = 35
    //   Reverse questions (3) contribute 1 each = 3
    //   Total = 38 / 50 = 76%
    const allFives: Record<string, number> = {};
    for (const q of BIGFIVE_QUESTIONS) {
      allFives[q.id] = 5;
    }
    const scores = calculateBigfiveScores(allFives);
    // With reverse scoring, all-5 should NOT produce 100
    const reverseCount = BIGFIVE_QUESTIONS.filter(
      (q) => q.dimension === "O" && q.reverse,
    ).length;
    if (reverseCount > 0) {
      expect(scores.O).toBeLessThan(100);
    }
  });
});
