import { database } from "@repo/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { SettingsIcon } from "lucide-react";
import { AdminSettingsClient } from "./client";

const AdminSettingsPage = async () => {
  let dbSettings: { key: string; value: string }[] = [];
  try {
    dbSettings = await database.setting.findMany();
  } catch {
    // ignore
  }

  const getSetting = (key: string, defaultValue = "false") =>
    dbSettings.find((s) => s.key === key)?.value || defaultValue;

  const settingsItems = [
    {
      key: "MAINTENANCE_MODE",
      label: "Maintenance Mode",
      description: "Enable to show a maintenance page to all users.",
      value: getSetting("MAINTENANCE_MODE") === "true",
    },
    {
      key: "REGISTRATION_ENABLED",
      label: "Registration Enabled",
      description: "Allow new users to sign up.",
      value: getSetting("REGISTRATION_ENABLED", "true") === "true",
    },
    {
      key: "AI_CHAT_ENABLED",
      label: "AI Chat Enabled",
      description: "Enable the AI chat feature for users.",
      value: getSetting("AI_CHAT_ENABLED", "true") === "true",
    },
    {
      key: "WEBHOOKS_ENABLED",
      label: "Webhooks Enabled",
      description: "Enable webhook delivery.",
      value: getSetting("WEBHOOKS_ENABLED", "true") === "true",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">Runtime configuration for the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Runtime Settings</CardTitle>
          </div>
          <CardDescription>Toggle platform-wide features and behaviors.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSettingsClient settings={settingsItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
