"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { PlusSignIcon, CheckListIcon } from "@hugeicons/core-free-icons";

export default function TasksPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const tasks = useQuery(api.tasks.list, userId ? { userId } : "skip");
  const [createOpen, setCreateOpen] = useState(false);

  const totalCount = tasks?.length ?? 0;
  const doneCount = tasks?.filter((t) => t.status === "done").length ?? 0;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon
              icon={CheckListIcon}
              size={20}
              className="text-primary"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Tasks
            </h1>
            {tasks !== undefined && (
              <p className="text-xs text-muted-foreground">
                {doneCount} of {totalCount} completed
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" />
          New Task
        </Button>
      </div>

      {/* Content */}
      {tasks === undefined ? (
        <TasksLoadingSkeleton />
      ) : (
        <TaskList tasks={tasks} onCreateClick={() => setCreateOpen(true)} />
      )}

      {/* Create dialog */}
      {userId && (
        <CreateTaskDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          userId={userId}
        />
      )}
    </div>
  );
}

function TasksLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Filter skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[18px] w-6 rounded-md" />
          </div>
          <div className="flex flex-col gap-1 pl-6">
            {[1, 2].map((j) => (
              <Skeleton key={j} className="h-11 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
