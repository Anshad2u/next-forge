"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import Link from "next/link";

interface OnboardingStep {
  title: string;
  description: string;
  href: string;
  completed: boolean;
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
}

export const OnboardingChecklist = ({ steps }: OnboardingChecklistProps) => {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Complete these steps to set up your account
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {completedCount}/{steps.length}
          </Badge>
        </div>
        <Progress className="mt-2" value={progress} />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {steps.map((step) => (
            <li
              key={step.title}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                ) : (
                  <CircleIcon className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {!step.completed && (
                <Button asChild size="sm" variant="outline">
                  <Link href={step.href}>Go</Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
