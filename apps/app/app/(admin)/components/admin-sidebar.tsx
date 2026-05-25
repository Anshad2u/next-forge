"use client";

import { UserButton } from "@repo/auth/client";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
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
} from "@repo/design-system/components/ui/sidebar";
import {
  ActivityIcon,
  BarChart3Icon,
  BotIcon,
  FlagIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  MessageSquareWarningIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminSidebarProps {
  readonly children: ReactNode;
}

const adminNav = [
  { title: "Overview", url: "/admin", icon: LayoutDashboardIcon },
  { title: "Users", url: "/admin/users", icon: UsersIcon },
  { title: "Organizations", url: "/admin/organizations", icon: GlobeIcon },
  { title: "Feature Flags", url: "/admin/feature-flags", icon: FlagIcon },
  { title: "Audit Log", url: "/admin/audit", icon: ShieldIcon },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
  { title: "Chat Settings", url: "/admin/chat-settings", icon: BotIcon },
  { title: "Health", url: "/admin/health", icon: ActivityIcon },
  { title: "Webhook Logs", url: "/admin/webhooks", icon: MessageSquareWarningIcon },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3Icon },
];

export const AdminSidebar = ({ children }: AdminSidebarProps) => (
  <>
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <ShieldIcon className="h-4 w-4" />
                <span className="font-semibold">Admin Panel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            {adminNav.map((item) => (
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
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>{children}</SidebarInset>
  </>
);
