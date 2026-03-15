import { z } from "zod";
import { TEST_TYPES } from "@efektif/shared";
import { router, protectedProcedure } from "./_app";

export const conversationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return [] as { id: string; testType: string; messageCount: number; completedAt: Date | null }[];
  }),

  messages: protectedProcedure
    .input(z.object({ testType: z.enum(TEST_TYPES) }))
    .query(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.testType;
      return [] as { role: "user" | "assistant"; content: string; createdAt: Date }[];
    }),

  send: protectedProcedure
    .input(z.object({ testType: z.enum(TEST_TYPES), message: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return { reply: "", isCompleted: false };
    }),
});
