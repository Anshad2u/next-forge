import { database } from "@repo/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { BotIcon } from "lucide-react";
import { ChatSettingsClient } from "./client";

const AdminChatSettingsPage = async () => {
  let dbSettings: { key: string; value: string }[] = [];
  try {
    dbSettings = await database.setting.findMany();
  } catch {
    // ignore
  }

  const getSetting = (key: string, defaultValue = "") =>
    dbSettings.find((s) => s.key === key)?.value || defaultValue;

  const settings = {
    apiKey: getSetting("AI_API_KEY"),
    endpoint: getSetting("AI_ENDPOINT", "https://api.openai.com/v1"),
    model: getSetting("AI_MODEL", "gpt-4o-mini"),
    maxTokens: getSetting("AI_MAX_TOKENS", "4096"),
    temperature: getSetting("AI_TEMPERATURE", "0.7"),
    systemPrompt: getSetting("AI_SYSTEM_PROMPT", "You are a helpful assistant for a SaaS application. Be concise and helpful."),
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chat Settings</h1>
        <p className="text-muted-foreground">Configure AI chat provider, model, and behavior.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>AI Configuration</CardTitle>
          </div>
          <CardDescription>
            Settings are stored in the database. Works with OpenAI, OpenRouter, or any OpenAI-compatible endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatSettingsClient settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChatSettingsPage;
