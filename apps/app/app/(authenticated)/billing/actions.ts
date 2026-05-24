"use server";

import { auth } from "@repo/auth/server";
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

  return { url: session.url };
};
