"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Switch } from "@repo/design-system/components/ui/switch";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { updateSetting } from "../settings/actions";

interface FeatureFlag {
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  scope: string;
}

interface FeatureFlagsClientProps {
  readonly flags: FeatureFlag[];
}

export const FeatureFlagsClient = ({ flags: initialFlags }: FeatureFlagsClientProps) => {
  const [flags, setFlags] = useState(initialFlags);
  const [saving, setSaving] = useState<string | null>(null);

  const handleToggle = useCallback(async (key: string, value: boolean) => {
    setSaving(key);
    try {
      await updateSetting(key, value ? "true" : "false");
      setFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, enabled: value } : f))
      );
      toast.success(`${value ? "Enabled" : "Disabled"} successfully`, {
        description: `Feature flag is now ${value ? "on" : "off"}`,
      });
    } catch {
      toast.error("Failed to update flag", {
        description: "Please try again.",
      });
    } finally {
      setSaving(null);
    }
  }, []);

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <div key={flag.key} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{flag.name}</p>
              <Badge variant="outline">{flag.scope}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{flag.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {saving === flag.key && (
              <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>
            )}
            <Switch
              checked={flag.enabled}
              onCheckedChange={(v) => handleToggle(flag.key, v)}
              disabled={saving === flag.key}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
