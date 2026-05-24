import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { DownloadIcon, FileTextIcon } from "lucide-react";

const InvoicesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let subscription = null;
  try {
    subscription = await database.subscription.findUnique({
      where: { userId },
    });
  } catch {
    // ignore
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          View and download your billing invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Billing History</CardTitle>
          </div>
          <CardDescription>
            Your past invoices and payment receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription?.stripeSubscriptionId ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {subscription.plan.charAt(0).toUpperCase() +
                        subscription.plan.slice(1)}{" "}
                      Plan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Subscription ID: {subscription.stripeSubscriptionId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      subscription.status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {subscription.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <FileTextIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No invoices yet. Subscribe to a plan to see billing history.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
