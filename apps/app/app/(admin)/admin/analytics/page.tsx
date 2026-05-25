import { database } from "@repo/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { BarChart3Icon, TrendingUpIcon, UsersIcon, DollarSignIcon } from "lucide-react";

const AdminAnalyticsPage = async () => {
  let totalUsers = 0;
  let paidUsers = 0;
  let totalConversations = 0;
  let totalMessages = 0;

  try {
    [totalUsers, paidUsers, totalConversations, totalMessages] = await Promise.all([
      database.user.count(),
      database.subscription.count({ where: { plan: { not: "free" }, status: "active" } }),
      database.conversation.count(),
      database.message.count(),
    ]);
  } catch {
    // ignore
  }

  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";
  const avgMessagesPerUser = totalUsers > 0 ? (totalMessages / totalUsers).toFixed(1) : "0";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform usage and growth metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidUsers}</div>
            <p className="text-xs text-muted-foreground">{conversionRate}% conversion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Messages/User</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMessagesPerUser}</div>
            <p className="text-xs text-muted-foreground">{totalMessages} total messages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
          <CardDescription>Key metrics at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">User → Paid Conversion</span>
              <span className="font-medium">{conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Messages per User</span>
              <span className="font-medium">{avgMessagesPerUser}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Platform Activity</span>
              <span className="font-medium">{totalMessages} messages across {totalConversations} conversations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
