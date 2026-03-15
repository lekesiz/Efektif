import { z } from "zod";
import { TEST_TYPES } from "@efektif/shared";
import type { TestResult, TestDraft } from "@efektif/shared";
import { router, protectedProcedure } from "./_app";

const testTypeSchema = z.enum(TEST_TYPES);

export const testsRouter = router({
  /** Submit a completed test */
  submit: protectedProcedure
    .input(
      z.object({
        testType: testTypeSchema,
        scores: z.record(z.string(), z.number()),
        analysis: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TestResult> => {
      const { testType, scores, analysis } = input;
      const userId = ctx.user.id;

      // Store test result in the database
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType,
        scores,
        interpretation: analysis ?? null,
        version: 1,
        completedAt: new Date(),
      };

      // DB insert would go here using userId and result
      void userId;

      return result;
    }),

  /** Get the latest result for a specific test type */
  latest: protectedProcedure
    .input(z.object({ testType: testTypeSchema }))
    .query(async ({ ctx, input }): Promise<TestResult | null> => {
      const userId = ctx.user.id;
      const { testType } = input;

      // DB query: SELECT * FROM test_results WHERE user_id = ? AND test_type = ? ORDER BY completed_at DESC LIMIT 1
      void userId;
      void testType;

      return null;
    }),

  /** Get all test results for the current user */
  results: protectedProcedure.query(
    async ({ ctx }): Promise<TestResult[]> => {
      const userId = ctx.user.id;

      // DB query: SELECT * FROM test_results WHERE user_id = ? ORDER BY completed_at DESC
      void userId;

      return [];
    },
  ),

  /** Save a test draft (in-progress answers) */
  saveDraft: protectedProcedure
    .input(
      z.object({
        testType: testTypeSchema,
        answers: z.record(z.string(), z.number()),
        currentIndex: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<{ saved: boolean }> => {
      const userId = ctx.user.id;

      // DB upsert: INSERT INTO test_drafts (user_id, test_type, answers, current_index, updated_at) ... ON CONFLICT UPDATE
      void userId;
      void input;

      return { saved: true };
    }),

  /** Load a saved test draft */
  loadDraft: protectedProcedure
    .input(z.object({ testType: testTypeSchema }))
    .query(async ({ ctx, input }): Promise<TestDraft | null> => {
      const userId = ctx.user.id;
      const { testType } = input;

      // DB query: SELECT * FROM test_drafts WHERE user_id = ? AND test_type = ?
      void userId;
      void testType;

      return null;
    }),

  /** Check whether the user can take a specific test */
  canTake: protectedProcedure
    .input(z.object({ testType: testTypeSchema }))
    .query(async ({ ctx, input }): Promise<{ allowed: boolean; reason?: string }> => {
      const userId = ctx.user.id;
      const { testType } = input;

      // Business logic: check if user has completed prerequisites,
      // hasn't exceeded retake limits, etc.
      void userId;
      void testType;

      return { allowed: true };
    }),
});
