import { auth, currentUser } from "@repo/auth/server";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import type { ReactNode } from "react";
import { env } from "@/env";
import { NotificationsProvider } from "./components/notifications-provider";
import { GlobalSidebar } from "./components/sidebar";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProperties) => {
  try {
    if (env.ARCJET_KEY) {
      try {
        await secure(["CATEGORY:PREVIEW"]);
      } catch {
        console.error("Arcjet security check failed");
      }
    }

    const user = await currentUser();
    const { redirectToSignIn } = await auth();
    const betaFeature = await showBetaFeature();

    if (!user) {
      return redirectToSignIn();
    }

    return (
      <NotificationsProvider userId={user.id}>
        <SidebarProvider>
          <GlobalSidebar>
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
  } catch (error) {
    console.error("Authenticated layout error:", error);
    throw error;
  }
};

export default AppLayout;
