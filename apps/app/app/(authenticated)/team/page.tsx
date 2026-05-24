import { auth, currentUser } from "@repo/auth/server";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/components/ui/avatar";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { UsersIcon, SettingsIcon, ExternalLinkIcon } from "lucide-react";

const TeamPage = async () => {
  const { userId, orgId, orgRole } = await auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n?.[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">
          Manage your team and organization settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Your Profile</CardTitle>
          </div>
          <CardDescription>Your account and organization details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              {orgRole && (
                <Badge variant="secondary" className="mt-1">
                  {orgRole}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Organization</CardTitle>
          </div>
          <CardDescription>
            {orgId
              ? "Manage your organization settings and members."
              : "Create or join an organization to collaborate with your team."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orgId ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Organization ID: <code className="text-xs">{orgId}</code>
              </p>
              <Button asChild variant="outline">
                <a
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage in Clerk Dashboard
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Use the organization switcher in the sidebar to create or join an
              organization.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPage;
