"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { updateSetting } from "../settings/actions";

interface ChatSettings {
  apiKey: string;
  endpoint: string;
  model: string;
  maxTokens: string;
  temperature: string;
  systemPrompt: string;
}

interface ChatSettingsClientProps {
  readonly settings: ChatSettings;
}

export const ChatSettingsClient = ({ settings: initial }: ChatSettingsClientProps) => {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleChange = useCallback((key: keyof ChatSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const entries: [string, string][] = [
        ["AI_API_KEY", settings.apiKey],
        ["AI_ENDPOINT", settings.endpoint],
        ["AI_MODEL", settings.model],
        ["AI_MAX_TOKENS", settings.maxTokens],
        ["AI_TEMPERATURE", settings.temperature],
        ["AI_SYSTEM_PROMPT", settings.systemPrompt],
      ];

      await Promise.all(entries.map(([k, v]) => updateSetting(k, v)));

      toast.success("Chat settings saved", {
        description: "Changes take effect immediately for new conversations.",
      });
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <div className="flex gap-2">
          <Input
            id="apiKey"
            type={showKey ? "text" : "password"}
            value={settings.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            placeholder="sk-... or sk-or-..."
          />
          <Button variant="outline" onClick={() => setShowKey(!showKey)}>
            {showKey ? "Hide" : "Show"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          OpenAI, OpenRouter, or any OpenAI-compatible API key.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endpoint">API Endpoint</Label>
        <Input
          id="endpoint"
          value={settings.endpoint}
          onChange={(e) => handleChange("endpoint", e.target.value)}
          placeholder="https://api.openai.com/v1"
        />
        <p className="text-xs text-muted-foreground">
          Use https://openrouter.ai/api/v1 for OpenRouter, or your custom endpoint.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={settings.model}
            onChange={(e) => handleChange("model", e.target.value)}
            placeholder="gpt-4o-mini"
          />
          <p className="text-xs text-muted-foreground">
            e.g. gpt-4o, gpt-4o-mini, anthropic/claude-3.5-sonnet, deepseek/deepseek-chat
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTokens">Max Tokens</Label>
          <Input
            id="maxTokens"
            type="number"
            value={settings.maxTokens}
            onChange={(e) => handleChange("maxTokens", e.target.value)}
            placeholder="4096"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="temperature">Temperature</Label>
        <Input
          id="temperature"
          type="number"
          step="0.1"
          min="0"
          max="2"
          value={settings.temperature}
          onChange={(e) => handleChange("temperature", e.target.value)}
          placeholder="0.7"
        />
        <p className="text-xs text-muted-foreground">
          0 = deterministic, 1 = balanced, 2 = creative
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <Textarea
          id="systemPrompt"
          value={settings.systemPrompt}
          onChange={(e) => handleChange("systemPrompt", e.target.value)}
          rows={4}
          placeholder="You are a helpful assistant..."
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Chat Settings"}
      </Button>
    </div>
  );
};
