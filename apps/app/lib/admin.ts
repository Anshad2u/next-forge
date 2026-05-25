import { auth } from "@repo/auth/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export const isAdmin = async (): Promise<boolean> => {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();
    return email ? ADMIN_EMAILS.includes(email) : false;
  } catch {
    return false;
  }
};

export const requireAdmin = async () => {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
};
