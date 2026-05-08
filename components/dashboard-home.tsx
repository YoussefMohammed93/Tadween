"use client";

import {
  CheckListIcon,
  NoteIcon,
  Folder01Icon,
  BookOpen01Icon,
  Add01Icon,
  Edit01Icon,
  FolderAddIcon,
  Calendar01Icon,
  Quote,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

type IconType = typeof Add01Icon;

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHome() {
  const router = useRouter();
  const userRecord = useQuery(api.users.currentUser);

  const greeting = getGreeting();

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Header & Quote Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-[2rem]">
              {greeting},
            </h1>
            {userRecord === undefined ? (
              <Skeleton className="h-9 w-40 rounded-lg" />
            ) : (
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-[2rem]">
                {userRecord?.firstName ?? "User"}
              </h1>
            )}
          </div>
          <p className="text-[15px] text-muted-foreground">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>

        {/* Motivational Quote Banner */}
        <div className="hidden max-w-[340px] items-start gap-3 rounded-2xl border border-border p-4 lg:flex">
          <HugeiconsIcon
            icon={Quote}
            size={18}
            className="mt-0.5 shrink-0 text-primary/40"
          />
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-medium italic leading-relaxed text-foreground/70">
              &quot;Focus on being productive instead of busy.&quot;
            </p>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Tim Ferriss
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value="0"
          description="2 due today"
          icon={CheckListIcon}
        />
        <StatCard
          title="Notes"
          value="0"
          description="0 created this week"
          icon={NoteIcon}
        />
        <StatCard
          title="Active Projects"
          value="0"
          description="1 pending review"
          icon={Folder01Icon}
        />
        <StatCard
          title="Lectures"
          value="0"
          description="No new recordings"
          icon={BookOpen01Icon}
        />
      </div>

      {/* Quick Actions Grid - Redesigned */}
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.1em] text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <QuickActionItem
            icon={Add01Icon}
            label="New Task"
            color="bg-primary"
            onClick={() => router.push("/tasks")}
          />
          <QuickActionItem
            icon={Edit01Icon}
            label="New Note"
            color="bg-orange-500"
            onClick={() => router.push("/notes")}
          />
          <QuickActionItem
            icon={FolderAddIcon}
            label="New Project"
            color="bg-emerald-500"
            onClick={() => router.push("/projects")}
          />
          <QuickActionItem
            icon={Calendar01Icon}
            label="Schedule"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Main Dashboard Content Layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left Column: Activity & Overview */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
                Recent Activity
              </h2>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/20 border border-border text-muted-foreground/40">
                <HugeiconsIcon icon={CheckListIcon} size={24} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Your workspace is fresh
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground/70">
                Start by adding your first task or creating a new project.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Pinned & Info */}
        <div className="flex flex-col gap-8">
          {/* Pinned Projects Section */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
              Pinned Projects
            </h2>
            <div className="flex flex-col gap-2">
              <PinnedProjectItem name="Internal Workflow" />
              <PinnedProjectItem name="Mobile App UI" />
              <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-border p-4">
                <span className="text-[12px] font-medium text-muted-foreground/60">
                  No pinned projects yet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: IconType;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
        </div>
        <span className="text-[13px] font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        <span className="text-[12px] font-medium text-muted-foreground/70">
          {description}
        </span>
      </div>
    </div>
  );
}

function QuickActionItem({
  icon,
  label,
  color,
  onClick,
}: {
  icon: IconType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} text-white`}
      >
        <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
      </div>
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
    </button>
  );
}

function PinnedProjectItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30 cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary/40" />
        <span className="truncate text-[13px] font-medium text-foreground">
          {name}
        </span>
      </div>
      <HugeiconsIcon
        icon={Folder01Icon}
        size={14}
        className="text-muted-foreground/40"
      />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
