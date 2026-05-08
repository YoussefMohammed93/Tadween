"use client";

import Image from "next/image";
import { useUser, useClerk } from "@clerk/clerk-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  CheckListIcon,
  NoteIcon,
  Folder01Icon,
  BookOpen01Icon,
  File01Icon,
  Image01Icon,
  HeartCheckIcon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";

const mainNavItems = [
  { title: "Dashboard", icon: Home01Icon, href: "/" },
  { title: "Tasks", icon: CheckListIcon, href: "/tasks" },
  { title: "Notes", icon: NoteIcon, href: "/notes" },
  { title: "Projects", icon: Folder01Icon, href: "/projects" },
  { title: "Lectures", icon: BookOpen01Icon, href: "/lectures" },
];

const libraryItems = [
  { title: "PDFs", icon: File01Icon, href: "/pdfs" },
  { title: "Media", icon: Image01Icon, href: "/media" },
  { title: "Lifestyle", icon: HeartCheckIcon, href: "/lifestyle" },
];

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AppSidebar() {
  const userRecord = useQuery(api.users.currentUser);
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  const initials =
    (userRecord?.firstName?.[0] ?? "") + (userRecord?.lastName?.[0] ?? "");

  return (
    <Sidebar collapsible="none" className="w-[240px] border-r border-border bg-sidebar">
      {/* Brand */}
      <SidebarHeader className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Tadween"
            width={28}
            height={28}
          />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Tadween
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    onClick={() => router.push(item.href)}
                    className="gap-3 rounded-lg text-[13px] font-medium transition-colors"
                  >
                    <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    onClick={() => router.push(item.href)}
                    className="gap-3 rounded-lg text-[13px] font-medium transition-colors"
                  >
                    <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-border bg-sidebar-muted/30">
        {/* Settings & Logout */}
        <SidebarMenu className="mb-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => router.push("/settings")}
              isActive={pathname === "/settings"}
              className="gap-3 rounded-lg text-[13px] font-medium transition-colors"
            >
              <HugeiconsIcon icon={Settings01Icon} size={18} strokeWidth={1.8} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => signOut()}
              className="gap-3 rounded-lg text-[13px] hover:bg-destructive/10! hover:text-destructive! font-medium transition-colors"
            >
              <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={1.8} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>


        {/* User card (Display only) */}
        <div className="flex items-center gap-2.5 p-2.5">
          {userRecord === undefined ? (
            <>
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-32" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-8 w-8 shrink-0 rounded-lg border border-border/50">
                <AvatarImage src={userRecord?.imageUrl} alt={userRecord?.firstName ?? ""} />
                <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-bold tracking-tight text-foreground">
                  {userRecord?.firstName} {userRecord?.lastName}
                </span>
                <span className="truncate text-[10px] font-medium text-muted-foreground/80">
                  {userRecord?.email}
                </span>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
