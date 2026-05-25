import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { MessageSquareWarningIcon, ExternalLinkIcon } from "lucide-react";

const AdminWebhooksPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Webhook Logs</h1>
        <p className="text-muted-foreground">View webhook delivery status and failures.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquareWarningIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Webhook Deliveries</CardTitle>
          </div>
          <CardDescription>
            View detailed webhook delivery logs in the Svix dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Stripe Payment Webhooks</p>
                <p className="text-sm text-muted-foreground">
                  Handles checkout.session.completed, subscription updates, and payment events.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href="/webhooks" target="_blank" rel="noopener noreferrer">
                  View in Svix <ExternalLinkIcon className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Clerk Auth Webhooks</p>
                <p className="text-sm text-muted-foreground">
                  Handles user.created, user.updated, and user.deleted events.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
                  View in Clerk <ExternalLinkIcon className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWebhooksPage;
