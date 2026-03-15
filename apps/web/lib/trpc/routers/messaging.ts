import { z } from "zod";
import { router, protectedProcedure } from "./_app";

export const messagingRouter = router({
  threads: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return [] as { id: string; participantName: string; lastMessage: string; updatedAt: Date }[];
  }),

  messages: protectedProcedure
    .input(z.object({ threadId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.threadId;
      return [] as { id: string; senderId: string; content: string; createdAt: Date }[];
    }),

  send: protectedProcedure
    .input(z.object({ threadId: z.string().uuid(), content: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return { id: crypto.randomUUID(), createdAt: new Date() };
    }),
});
