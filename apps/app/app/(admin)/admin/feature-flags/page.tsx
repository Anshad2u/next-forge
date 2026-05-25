import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { database } from "@repo/database";
import { FlagIcon } from "lucide-react";
import { FeatureFlagsClient } from "./client";

const AdminFeatureFlagsPage = async () => {
  let dbSettings: { key: string; value: string }[] = [];
  try {
    dbSettings = await database.setting.findMany();
  } catch {
    // ignore
  }

  const getSetting = (key: string, defaultValue = "false") =>
    dbSettings.find((s) => s.key === key)?.value || defaultValue;

  const flags = [
    {
      name: "Maintenance Mode",
      key: "MAINTENANCE_MODE",
      description: "Show a maintenance page to all users. Admins are unaffected.",
      enabled: getSetting("MAINTENANCE_MODE") === "true",
      scope: "Global",
    },
    {
      name: "Registration",
      key: "REGISTRATION_ENABLED",
      description: "Allow new users to sign up.",
      enabled: getSetting("REGISTRATION_ENABLED", "true") === "true",
      scope: "Global",
    },
    {
      name: "AI Chat",
      key: "AI_CHAT_ENABLED",
      description: "Enable the AI chat feature for users.",
      enabled: getSetting("AI_CHAT_ENABLED", "true") === "true",
      scope: "Global",
    },
    {
      name: "Webhooks",
      key: "WEBHOOKS_ENABLED",
      description: "Enable webhook delivery.",
      enabled: getSetting("WEBHOOKS_ENABLED", "true") === "true",
      scope: "Global",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-muted-foreground">Toggle platform features on or off.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Feature Flags</CardTitle>
          </div>
          <CardDescription>
            Toggle features on or off for all users. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureFlagsClient flags={flags} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatureFlagsPage;
