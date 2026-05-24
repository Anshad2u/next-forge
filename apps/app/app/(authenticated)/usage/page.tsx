import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Progress } from "@repo/design-system/components/ui/progress";
import { CoinsIcon, TrendingUpIcon, ZapIcon } from "lucide-react";

const UsagePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let subscription = null;
  try {
    subscription = await database.subscription.findUnique({
      where: { userId },
    });
  } catch {
    // ignore
  }

  const plan = subscription?.plan || "free";
  const planLimits: Record<string, { tokens: number; features: string[] }> = {
    free: {
      tokens: 1000,
      features: ["Basic analytics", "3 projects", "Community support"],
    },
    pro: {
      tokens: 50000,
      features: ["Unlimited projects", "Advanced analytics", "Priority support"],
    },
    enterprise: {
      tokens: 500000,
      features: ["Everything in Pro", "Custom integrations", "Dedicated support"],
    },
  };

  const currentLimit = planLimits[plan] || planLimits.free;
  const usedTokens = 0; // This would come from actual usage tracking

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="text-muted-foreground">
          Track your API usage and token consumption.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentLimit.tokens.toLocaleString()} tokens/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedTokens.toLocaleString()}</div>
            <Progress
              className="mt-2"
              value={(usedTokens / currentLimit.tokens) * 100}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {((usedTokens / currentLimit.tokens) * 100).toFixed(1)}% of monthly
              limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ZapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
              {subscription?.status || "No subscription"}
            </Badge>
            <p className="mt-2 text-xs text-muted-foreground">
              {subscription?.currentPeriodEnd
                ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : "Upgrade to get more tokens"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            Features included in your current plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentLimit.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage;
