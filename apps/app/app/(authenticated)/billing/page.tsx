"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { createCheckoutSession } from "./actions";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceId: null,
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro",
    popular: true,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "SSO & audit logs",
    ],
  },
];

const BillingPage = () => {
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const handleCheckout = useCallback(
    async (priceId: string) => {
      setCheckingOut(priceId);
      try {
        const result = await createCheckoutSession(priceId);
        if (result?.url) {
          router.push(result.url);
        }
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Checkout failed. Stripe may not be configured.");
      } finally {
        setCheckingOut(null);
      }
    },
    [router]
  );

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-4 text-sm text-green-600">
          <CheckCircle2Icon className="h-4 w-4" />
          Payment successful! Your subscription is now active.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col transition-all duration-300",
              plan.popular && "border-primary shadow-lg scale-105",
              checkingOut && "opacity-50 pointer-events-none"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
                /month
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.priceId ? (
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={checkingOut !== null}
                  onClick={() => handleCheckout(plan.priceId!)}
                >
                  {checkingOut === plan.priceId
                    ? "Redirecting to Stripe..."
                    : `Subscribe to ${plan.name}`}
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BillingPage;
