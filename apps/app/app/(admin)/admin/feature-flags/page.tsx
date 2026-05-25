import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { FlagIcon } from "lucide-react";

const AdminFeatureFlagsPage = async () => {
  // Feature flags are configured via Vercel Flags / environment variables
  // This page shows the current flag state
  const flags = [
    {
      name: "showBetaFeature",
      description: "Show beta features to users",
      enabled: process.env.FLAGS_SECRET ? true : false,
      scope: "Global",
    },
    {
      name: "maintenanceMode",
      description: "Enable maintenance mode for the platform",
      enabled: process.env.MAINTENANCE_MODE === "true",
      scope: "Global",
    },
    {
      name: "aiChatEnabled",
      description: "Enable AI chat functionality",
      enabled: !!process.env.OPENAI_API_KEY,
      scope: "Global",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-muted-foreground">Manage platform feature flags and rollouts.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Active Flags</CardTitle>
          </div>
          <CardDescription>
            Configure feature flags via Vercel dashboard or environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.name} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{flag.name}</p>
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{flag.scope}</Badge>
                  <Badge variant={flag.enabled ? "default" : "secondary"}>
                    {flag.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatureFlagsPage;
