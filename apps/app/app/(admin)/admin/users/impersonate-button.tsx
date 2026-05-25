"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createImpersonationToken } from "./actions";

interface ImpersonateButtonProps {
  readonly userId: string;
}

export const ImpersonateButton = ({ userId }: ImpersonateButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImpersonate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await createImpersonationToken(userId);
      if (result?.url) {
        window.open(result.url, "_blank");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Impersonation failed");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <Button variant="outline" size="sm" onClick={handleImpersonate} disabled={loading}>
      <LogInIcon className="mr-1 h-3 w-3" />
      {loading ? "Loading..." : "Login As"}
    </Button>
  );
};
