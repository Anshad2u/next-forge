import { auth } from "@repo/auth/server";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isAdmin } from "@/lib/admin";
import { AdminSidebar } from "./components/admin-sidebar";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const admin = await isAdmin();
  if (!admin) {
    notFound();
  }

  return (
    <SidebarProvider>
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </SidebarProvider>
  );
};

export default AdminLayout;
