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
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
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
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCheckingOut(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

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
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground animate-pulse">
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
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                disabled={checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut
                  ? "Redirecting to Stripe..."
                  : plan.name === "Free"
                    ? "Current Plan"
                    : `Subscribe to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {checkingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 shadow-xl animate-in zoom-in-95">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <div className="absolute inset-2 flex items-center justify-center">
                <span className="text-2xl">&#9889;</span>
              </div>
            </div>
            <p className="text-lg font-semibold">Connecting to Stripe...</p>
            <p className="text-sm text-muted-foreground">
              This is a mock checkout. Stripe is not yet configured.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
