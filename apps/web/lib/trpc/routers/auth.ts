import { router, publicProcedure } from "./_app";

export const authRouter = router({
  /** Return the currently authenticated user, or null */
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  /** Log out the current user by clearing the session cookie */
  logout: publicProcedure.mutation(async () => {
    // The actual cookie clearing happens on the API side.
    // This mutation signals the client to clear local state.
    return { success: true };
  }),
});
