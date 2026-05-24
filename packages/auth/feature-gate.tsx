"use client";

import { Protect, useOrganization } from "@clerk/nextjs";
import type { ReactNode } from "react";

interface FeatureGateProps {
  children: ReactNode;
  plan?: string;
  feature?: string;
  fallback?: ReactNode;
}

export const FeatureGate = ({
  children,
  plan,
  feature,
  fallback,
}: FeatureGateProps) => {
  return (
    <Protect
      condition={(has) => {
        if (plan) return has?.({ plan });
        if (feature) return has?.({ feature });
        return true;
      }}
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>This feature requires a higher plan.</p>
          </div>
        )
      }
    >
      {children}
    </Protect>
  );
};

export const useCurrentPlan = () => {
  const { organization } = useOrganization();
  return organization?.slug || "free";
};
