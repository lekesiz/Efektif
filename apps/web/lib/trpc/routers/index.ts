import { router } from "./_app";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { testsRouter } from "./tests";
import { careersRouter } from "./careers";
import { favoritesRouter } from "./favorites";
import { prioritiesRouter } from "./priorities";
import { conversationsRouter } from "./conversations";
import { notificationsRouter } from "./notifications";
import { diagnosticRouter } from "./diagnostic";
import { documentsRouter } from "./documents";
import { messagingRouter } from "./messaging";
import { adminRouter } from "./admin";
import { counselorRouter } from "./counselor";
import { stripeRouter } from "./stripe";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  tests: testsRouter,
  careers: careersRouter,
  favorites: favoritesRouter,
  priorities: prioritiesRouter,
  conversations: conversationsRouter,
  notifications: notificationsRouter,
  diagnostic: diagnosticRouter,
  documents: documentsRouter,
  messaging: messagingRouter,
  admin: adminRouter,
  counselor: counselorRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
