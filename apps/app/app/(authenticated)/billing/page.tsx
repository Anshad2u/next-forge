import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { log } from "@repo/observability/log";
import { BillingClient } from "./client";

const BillingPage = async () => {
  const { userId } = await auth();

  let currentPlan = "free";
  let currentStatus = "active";

  if (userId) {
    try {
      const subscription = await database.subscription.findUnique({
        where: { userId },
      });
      if (subscription) {
        currentPlan = subscription.plan;
        currentStatus = subscription.status;
      }
    } catch (e) {
      log.error("Failed to fetch subscription", { error: e });
    }
  }

  return (
    <BillingClient currentPlan={currentPlan} currentStatus={currentStatus} />
  );
};

export default BillingPage;
