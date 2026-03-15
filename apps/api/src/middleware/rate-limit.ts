import type { MiddlewareHandler } from "hono";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

/**
 * Rate limiting middleware using Upstash Redis.
 * Limits AI endpoints to prevent abuse and cost overruns.
 */
export const rateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  // TODO: Enable when Upstash Redis is configured
  // const ratelimit = new Ratelimit({
  //   redis: Redis.fromEnv(),
  //   limiter: Ratelimit.slidingWindow(10, "60 s"),
  //   analytics: true,
  // });
  //
  // const userId = c.get("userId");
  // const { success, limit, reset, remaining } = await ratelimit.limit(userId);
  //
  // c.header("X-RateLimit-Limit", limit.toString());
  // c.header("X-RateLimit-Remaining", remaining.toString());
  // c.header("X-RateLimit-Reset", reset.toString());
  //
  // if (!success) {
  //   return c.json({ error: "Rate limit exceeded" }, 429);
  // }

  await next();
};
