import { z } from "zod";
import type { UserProfile } from "@efektif/shared";
import { LOCALES } from "@efektif/shared";
import { router, protectedProcedure } from "./_app";

export const profileRouter = router({
  /** Get the current user's full profile */
  get: protectedProcedure.query(async ({ ctx }): Promise<UserProfile | null> => {
    const userId = ctx.user.id;

    // DB query: SELECT * FROM users WHERE id = ?
    void userId;

    return null;
  }),

  /** Update the current user's profile */
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        locale: z.enum(LOCALES).optional(),
        birthDate: z.string().datetime().optional(),
        city: z.string().max(100).optional(),
        country: z.string().max(100).optional(),
        schoolLevel: z.string().max(100).optional(),
        profileType: z.string().max(50).optional(),
        avatarUrl: z.string().url().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      const userId = ctx.user.id;

      // DB update: UPDATE users SET ... WHERE id = ?
      void userId;
      void input;

      return { success: true };
    }),
});
