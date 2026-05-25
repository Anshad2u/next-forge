import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ActivityIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";

interface HealthCheck {
  name: string;
  status: "ok" | "error";
  latency?: number;
  error?: string;
}

const checkDB = async (): Promise<HealthCheck> => {
  const start = Date.now();
  try {
    await database.$queryRaw`SELECT 1`;
    return { name: "Database", status: "ok", latency: Date.now() - start };
  } catch (e) {
    return { name: "Database", status: "error", error: String(e) };
  }
};

const checkClerk = async (): Promise<HealthCheck> => {
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    await client.users.getUserList({ limit: 1 });
    return { name: "Clerk Auth", status: "ok" };
  } catch (e) {
    return { name: "Clerk Auth", status: "error", error: String(e) };
  }
};

const checkStripe = async (): Promise<HealthCheck> => {
  try {
    const { stripe } = await import("@repo/payments");
    if (!stripe) return { name: "Stripe", status: "error", error: "Not configured" };
    await stripe.customers.list({ limit: 1 });
    return { name: "Stripe", status: "ok" };
  } catch (e) {
    return { name: "Stripe", status: "error", error: String(e) };
  }
};

const AdminHealthPage = async () => {
  const checks = await Promise.all([checkDB(), checkClerk(), checkStripe()]);
  const allHealthy = checks.every((c) => c.status === "ok");

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
        <Badge variant={allHealthy ? "default" : "destructive"}>
          {allHealthy ? "All Systems Operational" : "Issues Detected"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <Card key={check.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{check.name}</CardTitle>
              {check.status === "ok" ? (
                <CheckCircle2Icon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {check.status === "ok" ? "Healthy" : "Error"}
              </div>
              {check.latency && (
                <p className="text-xs text-muted-foreground">{check.latency}ms latency</p>
              )}
              {check.error && (
                <p className="mt-2 text-xs text-red-500">{check.error}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHealthPage;
