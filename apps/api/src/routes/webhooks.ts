import { Hono } from "hono";

export const webhookRoutes = new Hono();

// ─── Stripe Webhook ──────────────────────────────────────
webhookRoutes.post("/stripe", async (c) => {
  // TODO: Implement Stripe webhook with signature verification
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "Missing signature" }, 400);
  }

  return c.json({ received: true });
});
