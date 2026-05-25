import {
  Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { GlobeIcon, ExternalLinkIcon } from "lucide-react";

const AdminOrgsPage = async () => {
  let orgs: { id: string; name: string; slug: string; imageUrl: string; membersCount: number; createdAt: number }[] = [];

  try {
    const { clerkClient } = await import("@repo/auth/server");
    const client = await clerkClient();
    const response = await client.organizations.getOrganizationList({ limit: 100 });
    orgs = response.data.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      imageUrl: org.imageUrl,
      membersCount: org.membersCount,
      createdAt: org.createdAt,
    }));
  } catch {
    // ignore
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <p className="text-muted-foreground">{orgs.length} organizations on the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>All Organizations</CardTitle>
          </div>
          <CardDescription>Manage platform organizations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-muted-foreground">{org.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{org.membersCount} members</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <a href={`https://dashboard.clerk.com/organizations/${org.id}`} target="_blank" rel="noopener noreferrer">
                        Manage <ExternalLinkIcon className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {orgs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No organizations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrgsPage;
