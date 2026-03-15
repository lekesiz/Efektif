import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { aiRoutes } from "./routes/ai";
import { pdfRoutes } from "./routes/pdf";
import { webhookRoutes } from "./routes/webhooks";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

// ─── Global Middleware ───────────────────────────────────
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://efektif.net",
      "https://www.efektif.net",
    ],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// ─── Health Check ────────────────────────────────────────
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// ─── Webhooks (no auth, no rate limit) ───────────────────
app.route("/webhooks", webhookRoutes);

// ─── Authenticated Routes ────────────────────────────────
app.use("/ai/*", authMiddleware);
app.use("/ai/*", rateLimitMiddleware);
app.route("/ai", aiRoutes);

app.use("/pdf/*", authMiddleware);
app.route("/pdf", pdfRoutes);

// ─── Start Server ────────────────────────────────────────
const port = parseInt(process.env.PORT ?? "4000", 10);

console.log(`🚀 Efektif API running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
