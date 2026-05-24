"use client";

import { useOrganization } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  plan?: string; // minimum plan required
}

export const useFilteredNavItems = (items: NavItem[]) => {
  const { organization } = useOrganization();
  const currentPlan = organization?.slug || "free";

  const planHierarchy: Record<string, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  const currentLevel = planHierarchy[currentPlan] ?? 0;

  return items.filter((item) => {
    if (!item.plan) return true;
    const requiredLevel = planHierarchy[item.plan] ?? 0;
    return currentLevel >= requiredLevel;
  });
};
