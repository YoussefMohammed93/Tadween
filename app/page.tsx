"use client";

import Image from "next/image";
import { useAuth } from "@clerk/clerk-react";
import { AuthScreen } from "@/components/auth-screen";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardHome } from "@/components/dashboard-home";

export default function Main() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <div className="animate-pulse">
          <Image
            src="/logo.png"
            alt="Tadween"
            width={80}
            height={80}
            priority
          />
        </div>
        <span className="text-base font-medium text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  if (!isSignedIn) {
    return <AuthScreen />;
  }

  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
