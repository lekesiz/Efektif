import { z } from "zod";
import { router, adminProcedure } from "./_app";

export const adminRouter = router({
  users: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }).optional(),
    )
    .query(async ({ input }) => {
      void input;
      return { users: [] as { id: string; email: string; name: string; role: string }[], total: 0 };
    }),

  stats: adminProcedure.query(async () => {
    return { totalUsers: 0, activeToday: 0, testsCompleted: 0, revenue: 0 };
  }),

  updateUserRole: adminProcedure
    .input(z.object({ userId: z.string().uuid(), role: z.string() }))
    .mutation(async ({ input }) => {
      void input;
      return { success: true };
    }),
});
