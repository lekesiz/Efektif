import { z } from "zod";
import { router, protectedProcedure } from "./_app";

export const favoritesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return [] as { careerId: string; addedAt: Date }[];
  }),

  add: protectedProcedure
    .input(z.object({ careerId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.careerId;
      return { success: true };
    }),

  remove: protectedProcedure
    .input(z.object({ careerId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.careerId;
      return { success: true };
    }),
});
