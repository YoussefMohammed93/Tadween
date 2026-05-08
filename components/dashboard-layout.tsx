"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { UserSync } from "@/components/user-sync";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <UserSync />
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden">
          {/* Mobile-only topbar */}
          <header className="flex items-center border-b border-border px-5 py-3 md:hidden">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
