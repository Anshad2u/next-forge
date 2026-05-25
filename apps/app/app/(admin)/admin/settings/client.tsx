"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Switch } from "@repo/design-system/components/ui/switch";
import { SettingsIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { updateSetting } from "./actions";

interface SettingItem {
  key: string;
  label: string;
  description: string;
  value: boolean;
}

interface AdminSettingsClientProps {
  readonly settings: SettingItem[];
}

export const AdminSettingsClient = ({ settings: initialSettings }: AdminSettingsClientProps) => {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const handleToggle = useCallback(async (key: string, value: boolean) => {
    setSaving(key);
    try {
      await updateSetting(key, value ? "true" : "false");
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      );
    } catch (e) {
      alert("Failed to update setting");
    } finally {
      setSaving(null);
    }
  }, []);

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.key} className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">{setting.label}</p>
            <p className="text-sm text-muted-foreground">{setting.description}</p>
          </div>
          <Switch
            checked={setting.value}
            onCheckedChange={(v) => handleToggle(setting.key, v)}
            disabled={saving === setting.key}
          />
        </div>
      ))}
    </div>
  );
};
