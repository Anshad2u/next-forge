"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { logAuditEvent } from "@repo/database/audit";
import { stripe } from "@repo/payments";
import { headers } from "next/headers";

export const createCheckoutSession = async (priceId: string) => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/billing?success=true`,
    cancel_url: `${origin}/billing?canceled=true`,
    metadata: {
      userId,
    },
  });

  await logAuditEvent({
    userId,
    action: "checkout_initiated",
    resource: "billing",
    details: `Checkout session created for price ${priceId}`,
  });

  return { url: session.url };
};

export const createPortalSession = async () => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const subscription = await database.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("No subscription found");
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/billing`,
  });

  await logAuditEvent({
    userId,
    action: "portal_opened",
    resource: "billing",
    details: "Stripe customer portal opened",
  });

  return { url: session.url };
};
