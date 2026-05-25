"use server";

import { requireAdmin } from "@/lib/admin";

export const createImpersonationToken = async (userId: string) => {
  await requireAdmin();

  const { clerkClient } = await import("@repo/auth/server");
  const client = await clerkClient();

  const user = await client.users.getUser(userId);
  const token = await client.users.createImpersonationToken(userId, {
    expiresInSeconds: 3600, // 1 hour
  });

  return {
    url: `${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"}?__clerk_ticket=${token.token}`,
  };
};
