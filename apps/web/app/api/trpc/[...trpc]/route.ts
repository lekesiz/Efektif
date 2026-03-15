import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { appRouter } from "@/lib/trpc/routers";
import type { TRPCContext, TRPCUser } from "@/lib/trpc/routers/_app";

async function getUserFromRequest(): Promise<TRPCUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  // In production: verify JWT / lookup session in DB and return user
  void sessionToken;
  return null;
}

async function createContext(): Promise<TRPCContext> {
  const user = await getUserFromRequest();
  return { user };
}

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`[tRPC] ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });
}

export { handler as GET, handler as POST };
