import { z } from "zod";
import Stripe from "stripe";
import { STRIPE_PLANS } from "@efektif/shared";
import { router, protectedProcedure } from "./_app";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-12-18.acacia" });
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const stripeRouter = router({
  createCheckout: protectedProcedure
    .input(z.object({ plan: z.enum(["standard", "premium"]) }))
    .mutation(async ({ ctx, input }) => {
      const planConfig = STRIPE_PLANS[input.plan];
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: ctx.user.email,
        line_items: [
          {
            price_data: {
              currency: planConfig.currency,
              product_data: { name: `Efektif ${planConfig.name}` },
              unit_amount: planConfig.price,
            },
            quantity: 1,
          },
        ],
        metadata: { userId: ctx.user.id, plan: input.plan },
        success_url: `${BASE_URL}/dashboard?checkout=success`,
        cancel_url: `${BASE_URL}/pricing?checkout=cancel`,
      });
      return { url: session.url };
    }),

  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    // DB: SELECT stripe_customer_id FROM users WHERE id = ctx.user.id
    const customerId = ctx.user.id; // placeholder: use real customer ID
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${BASE_URL}/dashboard`,
    });
    return { url: session.url };
  }),

  subscription: protectedProcedure.query(async ({ ctx }) => {
    // DB: SELECT access_level, stripe_subscription_status, stripe_current_period_end FROM users WHERE id = ?
    void ctx.user.id;
    return {
      plan: ctx.user.accessLevel,
      status: ctx.user.accessLevel === "free" ? "none" : "active",
      currentPeriodEnd: null as Date | null,
    };
  }),
});
