import { z } from "zod";
import { router, protectedProcedure } from "./_app";

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false) }).optional())
    .query(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return [] as { id: string; type: string; title: string; read: boolean; createdAt: Date }[];
    }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return 0;
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.id;
      return { success: true };
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    void ctx.user.id;
    return { success: true };
  }),
});
