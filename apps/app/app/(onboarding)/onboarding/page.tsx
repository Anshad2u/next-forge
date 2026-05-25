"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { CheckCircle2Icon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = [
  {
    title: "Welcome",
    description: "Let's get you started with your new account.",
  },
  {
    title: "Your Organization",
    description: "Create or join an organization to collaborate with your team.",
  },
  {
    title: "Choose a Plan",
    description: "Select the plan that works best for you.",
  },
  {
    title: "You're All Set!",
    description: "Your account is ready. Start building.",
  },
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-center gap-2">
                {i < currentStep ? (
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      i === currentStep
                        ? "border-primary bg-primary"
                        : "border-muted"
                    }`}
                  />
                )}
                {i < steps.length - 1 && (
                  <div className="h-px w-8 bg-muted" />
                )}
              </div>
            ))}
          </div>
          <CardTitle className="mt-4">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Welcome to your new SaaS starter! This wizard will help you set
                up your account in just a few steps.
              </p>
              <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                Account created successfully
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Organizations let you collaborate with team members and manage
                billing together.
              </p>
              <Input
                placeholder="Organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can also create an organization later from the sidebar.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start with the free plan and upgrade anytime from the Billing
                page.
              </p>
              <div className="rounded-md border p-4">
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  Up to 3 projects, basic analytics, community support
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 py-4">
                <CheckCircle2Icon className="h-12 w-12 text-green-500" />
                <p className="text-lg font-medium">All set!</p>
                <p className="text-sm text-muted-foreground">
                  Your account is ready. Start by exploring the dashboard.
                </p>
              </div>
            </div>
          )}

          <Button className="w-full" onClick={nextStep}>
            {currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
