import type { MiddlewareHandler } from "hono";

/**
 * Authentication middleware.
 * Validates session token and injects user context.
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  // TODO: Implement Better Auth session validation
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // const token = authHeader.slice(7);
  // const session = await validateSession(token);
  // if (!session) {
  //   return c.json({ error: "Invalid session" }, 401);
  // }
  // c.set("userId", session.userId);
  // c.set("userRole", session.role);

  await next();
};
