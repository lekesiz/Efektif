import { z } from "zod";
import { router, protectedProcedure } from "./_app";

export const prioritiesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return [] as { careerId: string; rank: number }[];
  }),

  set: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({ careerId: z.string().uuid(), rank: z.number().int().min(1) }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.items;
      return { success: true };
    }),
});
