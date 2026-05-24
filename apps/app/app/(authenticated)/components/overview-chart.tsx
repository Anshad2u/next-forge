"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 4000, users: 240 },
  { month: "Feb", revenue: 3000, users: 139 },
  { month: "Mar", revenue: 2000, users: 980 },
  { month: "Apr", revenue: 2780, users: 390 },
  { month: "May", revenue: 1890, users: 480 },
  { month: "Jun", revenue: 2390, users: 380 },
  { month: "Jul", revenue: 3490, users: 430 },
];

export const OverviewChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
      <CardDescription>Monthly revenue for the past 7 months</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={monthlyData}>
          <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
          <XAxis
            className="text-xs"
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const UsersChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Growth</CardTitle>
      <CardDescription>New users per month</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer height={300} width="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
          <XAxis
            className="text-xs"
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="users"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
