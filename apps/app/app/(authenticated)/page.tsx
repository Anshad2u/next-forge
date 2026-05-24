import type { Metadata } from "next";
import { auth, currentUser } from "@repo/auth/server";
import { database, type Page } from "@repo/database";
import { log } from "@repo/observability/log";
import { secure } from "@repo/security";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import {
  CreditCardIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";

const title = "Dashboard";
const description = "Overview of your account";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  let pages: Page[] = [];
  let error: string | null = null;
  let currentPlan = "Free";

  try {
    await secure();
  } catch {
    log.warn("Arcjet secure check failed");
  }

  try {
    pages = await database.page.findMany({ take: 10 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    error = msg;
    log.error("DB error: " + msg);
  }

  if (userId) {
    try {
      const subscription = await database.subscription.findUnique({
        where: { userId },
      });
      if (subscription?.plan && subscription.plan !== "free") {
        currentPlan =
          subscription.plan.charAt(0).toUpperCase() +
          subscription.plan.slice(1);
      }
    } catch {
      // ignore
    }
  }

  const userName =
    user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "there";

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your account
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          DB error: {error}
        </p>
      )}

      {!orgId && (
        <p className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-500">
          No organization selected. Use the organization switcher in the sidebar
          to get started.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">
              Content pages in your database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPlan}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/billing" className="underline">
                Upgrade to Pro
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orgId ? "Active" : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {orgId ? "Organization is set up" : "Create or join an organization"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">Manage Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/billing">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Manage Billing
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/webhooks">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Configure Webhooks
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Pages from your database</CardDescription>
          </CardHeader>
          <CardContent>
            {pages.length > 0 ? (
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li
                    key={page.id}
                    className="flex items-center gap-2 rounded-md border p-2 text-sm"
                  >
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    {page.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No pages found. Your database may need to be seeded.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
