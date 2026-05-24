import { analytics } from "@repo/analytics/server";
import { clerkClient } from "@repo/auth/server";
import { database } from "@repo/database";
import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
import type { Stripe } from "@repo/payments";
import { stripe } from "@repo/payments";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";

const getUserFromCustomerId = async (customerId: string) => {
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList();

  const user = users.data.find(
    (currentUser) => currentUser.privateMetadata.stripeCustomerId === customerId
  );

  return user;
};

const handleCheckoutSessionCompleted = async (
  data: Stripe.Checkout.Session
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const userId = data.metadata?.userId;

  if (!userId) {
    log.warn("No userId in checkout session metadata");
    return;
  }

  // Store stripeCustomerId in Clerk user metadata
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      privateMetadata: {
        stripeCustomerId: customerId,
      },
    });
  } catch (error) {
    log.error("Failed to update Clerk user metadata", { error });
  }

  // Save subscription to database
  try {
    const subscriptionId =
      typeof data.subscription === "string"
        ? data.subscription
        : data.subscription?.id;

    await database.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: "pro",
        status: "active",
      },
      update: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: "pro",
        status: "active",
      },
    });
  } catch (error) {
    log.error("Failed to save subscription to DB", { error });
  }

  analytics?.capture({
    event: "User Subscribed",
    distinctId: userId,
  });
};

const handleSubscriptionScheduleCanceled = async (
  data: Stripe.SubscriptionSchedule
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  // Update subscription status in database
  try {
    await database.subscription.update({
      where: { userId: user.id },
      data: { status: "canceled", plan: "free" },
    });
  } catch (error) {
    log.error("Failed to update subscription in DB", { error });
  }

  analytics?.capture({
    event: "User Unsubscribed",
    distinctId: user.id,
  });
};

export const POST = async (request: Request): Promise<Response> => {
  if (!(stripe && env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ message: "Not configured", ok: false });
  }

  try {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      throw new Error("missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const user = await getUserFromCustomerId(customerId);
        if (user) {
          const plan =
            subscription.items.data[0]?.price?.unit_amount === 9900
              ? "enterprise"
              : "pro";
          await database.subscription
            .update({
              where: { userId: user.id },
              data: {
                status: subscription.status === "active" ? "active" : "past_due",
                plan,
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            })
            .catch(() => null);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const user = await getUserFromCustomerId(customerId);
        if (user) {
          await database.subscription
            .update({
              where: { userId: user.id },
              data: { status: "canceled", plan: "free" },
            })
            .catch(() => null);
        }
        break;
      }
      case "subscription_schedule.canceled": {
        await handleSubscriptionScheduleCanceled(event.data.object);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.type}`);
      }
    }

    await analytics?.shutdown();

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    const message = parseError(error);

    log.error(message);

    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
};
