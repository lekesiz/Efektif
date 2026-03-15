import { z } from "zod";
import { router, counselorProcedure } from "./_app";

export const counselorRouter = router({
  students: counselorProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return { students: [] as { id: string; name: string; email: string; progress: number }[], total: 0 };
    }),

  studentDetail: counselorProcedure
    .input(z.object({ studentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.studentId;
      return null as {
        id: string;
        name: string;
        email: string;
        testResults: unknown[];
        journeyStage: string;
      } | null;
    }),

  addNote: counselorProcedure
    .input(z.object({ studentId: z.string().uuid(), content: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return { id: crypto.randomUUID(), createdAt: new Date() };
    }),
});
