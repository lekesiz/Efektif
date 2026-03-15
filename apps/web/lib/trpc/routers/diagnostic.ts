import { router, protectedProcedure } from "./_app";

export const diagnosticRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return null as {
      overview: string;
      strengths: string[];
      growthAreas: string[];
      careerThemes: string[];
      generatedAt: Date;
    } | null;
  }),

  generate: protectedProcedure.mutation(async ({ ctx }) => {
    void ctx.user.id;
    return { success: true, jobId: crypto.randomUUID() };
  }),
});
