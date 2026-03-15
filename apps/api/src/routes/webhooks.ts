import { Hono } from "hono";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-12-18.acacia" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const webhookRoutes = new Hono();

// ─── Stripe Webhook ──────────────────────────────────────
webhookRoutes.post("/stripe", async (c) => {
  const signature = c.req.header("stripe-signature");
  if (!signature) return c.json({ error: "Missing signature" }, 400);

  const body = await c.req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: `Webhook signature verification failed: ${msg}` }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "standard" | "premium" | undefined;
      if (userId && plan) {
        // DB: UPDATE users SET access_level = plan WHERE id = userId
        console.log(`[webhook] Upgrading user ${userId} to ${plan}`);
        // DB: INSERT INTO notifications (user_id, type, title, message)
        console.log(`[webhook] Notification created for user ${userId}`);
      }
      break;
    }
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const userId = pi.metadata?.userId;
      console.log(`[webhook] Payment succeeded: ${pi.id} for user ${userId ?? "unknown"}`);
      // DB: INSERT INTO payments (user_id, stripe_payment_intent_id, amount, currency, status)
      break;
    }
    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return c.json({ received: true });
});
