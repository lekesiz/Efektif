import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { AccessLevel, UserRole } from "@efektif/shared";
import { PAID_ACCESS_LEVELS } from "@efektif/shared";

// ─── Context ─────────────────────────────────────────────
export interface TRPCUser {
  id: string;
  email: string;
  role: UserRole;
  accessLevel: AccessLevel;
}

export interface TRPCContext {
  user: TRPCUser | null;
}

// ─── tRPC Instance ───────────────────────────────────────
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof Error
            ? error.cause.message
            : null,
      },
    };
  },
});

// ─── Exports ─────────────────────────────────────────────
export const router = t.router;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;

// ─── Procedures ──────────────────────────────────────────

/** Procedure accessible to anyone, user may or may not be authenticated */
export const publicProcedure = t.procedure;

/** Procedure requiring an authenticated user */
export const protectedProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource.",
      });
    }
    return next({ ctx: { user: ctx.user } });
  }),
);

/** Procedure requiring a paid user (standard or premium) */
export const paidProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in.",
      });
    }
    if (!PAID_ACCESS_LEVELS.includes(ctx.user.accessLevel)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires a paid subscription.",
      });
    }
    return next({ ctx: { user: ctx.user } });
  }),
);

/** Procedure requiring premium access */
export const premiumProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in.",
      });
    }
    if (ctx.user.accessLevel !== "premium") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires a premium subscription.",
      });
    }
    return next({ ctx: { user: ctx.user } });
  }),
);

/** Procedure requiring counselor role */
export const counselorProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in.",
      });
    }
    if (ctx.user.role !== "counselor" && ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires counselor privileges.",
      });
    }
    return next({ ctx: { user: ctx.user } });
  }),
);

/** Procedure requiring admin role */
export const adminProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in.",
      });
    }
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires admin privileges.",
      });
    }
    return next({ ctx: { user: ctx.user } });
  }),
);
