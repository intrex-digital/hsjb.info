"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-border/40 bg-background px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-semibold">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button id="admin-logout-button" variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="mt-3 text-muted-foreground">
            {user?.first_name ? `Hello, ${user.first_name}!` : `Signed in as ${user?.email}`}
          </p>
          <p className="mt-6 text-sm text-muted-foreground/60">
            Content management sections will appear here as they are built.
          </p>
        </div>
      </main>
    </div>
  );
}
