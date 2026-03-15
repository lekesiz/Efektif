import { z } from "zod";
import type { CareerSummary, CareerMatch } from "@efektif/shared";
import { SMART_MATCH_LIMIT } from "@efektif/shared";
import { router, publicProcedure, premiumProcedure } from "./_app";

export const careersRouter = router({
  /** List careers with optional filters */
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<CareerSummary[]> => {
      const { category, search, limit, offset } = input ?? {
        limit: 20,
        offset: 0,
      };

      // DB query: SELECT * FROM careers WHERE category = ? AND (name_fr ILIKE ? OR name_en ILIKE ?) LIMIT ? OFFSET ?
      void category;
      void search;
      void limit;
      void offset;

      return [];
    }),

  /** Count careers matching filters */
  count: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<number> => {
      const { category, search } = input ?? {};

      // DB query: SELECT COUNT(*) FROM careers WHERE ...
      void category;
      void search;

      return 0;
    }),

  /** Get a single career by its code */
  getByCode: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }): Promise<CareerSummary | null> => {
      const { code } = input;

      // DB query: SELECT * FROM careers WHERE code = ?
      void code;

      return null;
    }),

  /** Get all distinct career categories */
  categories: publicProcedure.query(async (): Promise<string[]> => {
    // DB query: SELECT DISTINCT category FROM careers ORDER BY category
    return [];
  }),

  /** AI-powered smart career matching (premium only) */
  smartMatch: premiumProcedure.query(
    async ({ ctx }): Promise<CareerMatch[]> => {
      const userId = ctx.user.id;

      // 1. Load user's test results (RIASEC, BigFive, Values)
      // 2. Run AI matching algorithm
      // 3. Return top matches with scores and reasons
      void userId;
      void SMART_MATCH_LIMIT;

      return [];
    },
  ),
});
