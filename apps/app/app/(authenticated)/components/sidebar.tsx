"use client";

import { OrganizationSwitcher, UserButton } from "@repo/auth/client";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import {
  AnchorIcon,
  BotIcon,
  CoinsIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "./search";

interface GlobalSidebarProperties {
  readonly children: ReactNode;
  readonly currentPlan?: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboardIcon;
  plan?: string; // Minimum plan required: "free", "pro", "enterprise"
}

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboardIcon,
    plan: "free",
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCardIcon,
    plan: "free",
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileTextIcon,
    plan: "free",
  },
  {
    title: "Team",
    url: "/team",
    icon: UsersIcon,
    plan: "pro",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    plan: "free",
  },
  {
    title: "Webhooks",
    url: "/webhooks",
    icon: AnchorIcon,
    plan: "free",
  },
  {
    title: "Audit Log",
    url: "/audit",
    icon: ShieldIcon,
    plan: "pro",
  },
  {
    title: "Usage",
    url: "/usage",
    icon: CoinsIcon,
    plan: "free",
  },
  {
    title: "AI Chat",
    url: "/chat",
    icon: BotIcon,
    plan: "pro",
  },
  {
    title: "Themes",
    url: "/themes",
    icon: PaletteIcon,
    plan: "free",
  },
];

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

const filterNavByPlan = (items: NavItem[], currentPlan: string) => {
  const planLevel = PLAN_HIERARCHY[currentPlan] ?? 0;
  return items.filter((item) => {
    const requiredLevel = PLAN_HIERARCHY[item.plan || "free"] ?? 0;
    return planLevel >= requiredLevel;
  });
};

export const GlobalSidebar = ({
  children,
  currentPlan = "free",
}: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const filteredNav = filterNavByPlan(navMain, currentPlan);

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  "h-[36px] overflow-hidden transition-all [&>div]:w-full",
                  sidebar.open ? "" : "-mx-1"
                )}
              >
                <OrganizationSwitcher
                  afterSelectOrganizationUrl="/"
                  hidePersonal
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Search />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {filteredNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "flex overflow-hidden w-full",
                    userButtonBox: "flex-row-reverse",
                    userButtonOuterIdentifier: "truncate pl-0",
                  },
                }}
                showName
              />
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
                <Button
                  asChild
                  className="shrink-0"
                  size="icon"
                  variant="ghost"
                >
                  <div className="h-4 w-4">
                    <NotificationsTrigger />
                  </div>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
