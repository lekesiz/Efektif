import { z } from "zod";
import { router, protectedProcedure } from "./_app";

export const stripeRouter = router({
  createCheckout: protectedProcedure
    .input(z.object({ plan: z.enum(["standard", "premium"]) }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.plan;
      return { url: "" };
    }),

  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    void ctx.user.id;
    return { url: "" };
  }),

  subscription: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return null as {
      plan: string;
      status: string;
      currentPeriodEnd: Date;
    } | null;
  }),
});
