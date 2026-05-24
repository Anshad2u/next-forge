import { auth } from "@repo/auth/server";
import { getAuditLogs } from "@repo/database/audit";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ShieldIcon } from "lucide-react";

const AuditPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const logs = await getAuditLogs(userId, 100);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">
          Track all actions performed on your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Activity History</CardTitle>
          </div>
          <CardDescription>
            {logs.length} event{logs.length !== 1 ? "s" : ""} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="divide-y">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    {log.resource && (
                      <p className="text-xs text-muted-foreground">
                        {log.resource}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.action.split(".")[0]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No audit events recorded yet. Actions like sign-in, billing
              changes, and settings updates will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
