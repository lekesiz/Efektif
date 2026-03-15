import "server-only";

import { cookies } from "next/headers";
import { appRouter } from "./routers";
import { createCallerFactory } from "./routers/_app";
import type { TRPCContext, TRPCUser } from "./routers/_app";

const createCaller = createCallerFactory(appRouter);

/**
 * Parse the session cookie to extract the authenticated user.
 * In production this would verify a JWT or look up a session in the database.
 */
async function getUserFromCookie(): Promise<TRPCUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  // In production: verify JWT / lookup session in DB and return user
  void sessionToken;
  return null;
}

/**
 * Create a tRPC caller for use in Server Components and Server Actions.
 *
 * Usage:
 * ```ts
 * import { serverTRPC } from "@/lib/trpc/server";
 *
 * export default async function Page() {
 *   const caller = await serverTRPC();
 *   const user = await caller.auth.me();
 *   return <div>{user?.email}</div>;
 * }
 * ```
 */
export async function serverTRPC() {
  const user = await getUserFromCookie();
  const ctx: TRPCContext = { user };
  return createCaller(ctx);
}
