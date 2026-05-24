import { auth, currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { showBetaFeature } from "@repo/feature-flags";
import type { ReactNode } from "react";
import { env } from "@/env";
import { CommandPalette } from "./components/command-palette";
import { NotificationsProvider } from "./components/notifications-provider";
import { GlobalSidebar } from "./components/sidebar";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const user = await currentUser();
  const { userId, redirectToSignIn } = await auth();
  let betaFeature = false;

  try {
    betaFeature = await showBetaFeature();
  } catch {
    console.error("showBetaFeature failed");
  }

  if (!user) {
    return redirectToSignIn();
  }

  let currentPlan = "free";
  if (userId) {
    try {
      const subscription = await database.subscription.findUnique({
        where: { userId },
      });
      if (subscription?.plan) {
        currentPlan = subscription.plan;
      }
    } catch {
      // ignore
    }
  }

  return (
    <NotificationsProvider userId={user.id}>
      <SidebarProvider>
        <GlobalSidebar currentPlan={currentPlan}>
          <CommandPalette />
          {betaFeature && (
            <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
