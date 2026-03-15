import { describe, it, expect } from "vitest";
import {
  calculateMatchScore,
  calculateBigfiveBonus,
  calculateValuesBonus,
  findBestMatches,
} from "./career-matcher";
import type { StudentProfile, CareerProfile } from "./career-matcher";

const makeCareerProfile = (
  overrides: Partial<CareerProfile> = {},
): CareerProfile => ({
  career: {
    id: "test-1",
    code: "T001",
    nameFr: "Test Career",
    nameTr: null,
    nameEn: null,
    category: null,
    educationLevel: null,
    salaryMin: null,
    salaryMax: null,
    aiImpactScore: null,
  },
  riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
  ...overrides,
});

describe("calculateMatchScore", () => {
  it("should return a number between 0 and 100", () => {
    const score = calculateMatchScore(
      { R: 80, I: 60, A: 40, S: 20, E: 70, C: 30 },
      { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
    );
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should return 100 for a perfect match", () => {
    const profile = { R: 80, I: 60, A: 40, S: 90, E: 20, C: 70 };
    const score = calculateMatchScore(profile, profile);
    expect(score).toBe(100);
  });

  it("should return a low score for opposite profiles", () => {
    const score = calculateMatchScore(
      { R: 100, I: 100, A: 100, S: 0, E: 0, C: 0 },
      { R: 0, I: 0, A: 0, S: 100, E: 100, C: 100 },
    );
    expect(score).toBeLessThan(30);
  });

  it("should be symmetric", () => {
    const a = { R: 90, I: 20, A: 70, S: 40, E: 60, C: 10 };
    const b = { R: 30, I: 80, A: 50, S: 60, E: 10, C: 90 };
    expect(calculateMatchScore(a, b)).toBe(calculateMatchScore(b, a));
  });
});

describe("findBestMatches", () => {
  it("should return results sorted by matchScore descending", () => {
    const student: StudentProfile = {
      riasec: { R: 90, I: 80, A: 20, S: 30, E: 40, C: 50 },
    };
    const careers = [
      makeCareerProfile({
        career: { ...makeCareerProfile().career, id: "c1" },
        riasec: { R: 10, I: 10, A: 90, S: 90, E: 90, C: 10 },
      }),
      makeCareerProfile({
        career: { ...makeCareerProfile().career, id: "c2" },
        riasec: { R: 90, I: 80, A: 20, S: 30, E: 40, C: 50 },
      }),
      makeCareerProfile({
        career: { ...makeCareerProfile().career, id: "c3" },
        riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
      }),
    ];
    const results = findBestMatches(student, careers);
    expect(results.length).toBe(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].matchScore).toBeGreaterThanOrEqual(
        results[i].matchScore,
      );
    }
  });

  it("should add bigfive bonus when profiles are provided", () => {
    const student: StudentProfile = {
      riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
      bigfive: { O: 80, C: 70, E: 60, A: 50, N: 40 },
    };
    const career = makeCareerProfile({
      bigfive: { O: 80, C: 70, E: 60, A: 50, N: 40 },
    });
    const results = findBestMatches(student, [career]);
    expect(results[0].bigfiveScore).toBeGreaterThan(0);
  });

  it("should add values bonus when profiles are provided", () => {
    const student: StudentProfile = {
      riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
      values: {
        achievement: 80,
        independence: 70,
        recognition: 60,
        relationships: 50,
        support: 40,
        working_conditions: 30,
      },
    };
    const career = makeCareerProfile({
      values: {
        achievement: 80,
        independence: 70,
        recognition: 60,
        relationships: 50,
        support: 40,
        working_conditions: 30,
      },
    });
    const results = findBestMatches(student, [career]);
    expect(results[0].valuesScore).toBeGreaterThan(0);
  });

  it("should respect the limit option", () => {
    const student: StudentProfile = {
      riasec: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
    };
    const careers = Array.from({ length: 10 }, (_, i) =>
      makeCareerProfile({
        career: { ...makeCareerProfile().career, id: `c${i}` },
      }),
    );
    const results = findBestMatches(student, careers, { limit: 3 });
    expect(results.length).toBe(3);
  });
});
