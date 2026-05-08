"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusSignIcon,
  CheckListIcon,
  ListViewIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { useQuery } from "convex/react";
import { useState, useMemo } from "react";
import type { Task } from "@/convex/tasks";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskList } from "@/components/tasks/task-list";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { DeleteAlertDialog } from "@/components/tasks/delete-alert-dialog";

type TaskType = "all" | "daily" | "monthly" | "yearly";
type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

export default function TasksPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [view, setView] = useState<"list" | "kanban">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tadween-task-view");
      return saved === "kanban" ? "kanban" : "list";
    }
    return "list";
  });
  const [activeType, setActiveType] = useState<TaskType>("all");
  const [activeStatuses, setActiveStatuses] = useState<Status[]>([]);
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<Status | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"tasks"> | null>(null);

  const tasks = useQuery(api.tasks.list, userId ? { userId } : "skip");

  const handleViewChange = (newView: "list" | "kanban") => {
    setView(newView);
    localStorage.setItem("tadween-task-view", newView);
  };

  const handleStatusToggle = (status: Status) => {
    setActiveStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const handlePriorityToggle = (priority: Priority) => {
    setActivePriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority],
    );
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      if (activeType !== "all" && task.type !== activeType) return false;
      if (
        view === "list" &&
        activeStatuses.length > 0 &&
        !activeStatuses.includes(task.status)
      )
        return false;
      if (
        activePriorities.length > 0 &&
        !activePriorities.includes(task.priority)
      )
        return false;
      return true;
    });
  }, [tasks, activeType, activeStatuses, activePriorities, view]);

  const totalCount = tasks?.length ?? 0;
  const doneCount = tasks?.filter((t) => t.status === "done").length ?? 0;

  const handleCreateOpen = (status?: Status) => {
    setInitialStatus(status);
    setCreateOpen(true);
  };

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

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <TooltipProvider>
            <div className="flex items-center gap-1 mr-2 bg-muted/30 p-1 rounded-lg border border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-md"
                    onClick={() => handleViewChange("list")}
                  >
                    <HugeiconsIcon
                      icon={ListViewIcon}
                      size={16}
                      color="currentColor"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={view === "kanban" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-md"
                    onClick={() => handleViewChange("kanban")}
                  >
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      size={16}
                      color="currentColor"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Kanban view</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button
            size="sm"
            className="gap-1.5 rounded-lg h-9"
            onClick={() => handleCreateOpen()}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" />
            New Task
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        <TaskFilters
          activeType={activeType}
          onTypeChange={setActiveType}
          activeStatuses={activeStatuses}
          onStatusToggle={handleStatusToggle}
          activePriorities={activePriorities}
          onPriorityToggle={handlePriorityToggle}
          hideStatus={view === "kanban"}
        />

        {tasks === undefined ? (
          <TasksLoadingSkeleton />
        ) : view === "list" ? (
          <TaskList
            tasks={filteredTasks}
            activeType={activeType}
            onEditClick={(task) => {
              setEditingTask(task);
              setSheetOpen(true);
            }}
            onViewClick={(task) => {
              setDrawerTask(task);
              setDrawerOpen(true);
            }}
            onCreateClick={() => handleCreateOpen()}
          />
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onEditClick={(task) => {
              setEditingTask(task);
              setSheetOpen(true);
            }}
            onViewClick={(task) => {
              setDrawerTask(task);
              setDrawerOpen(true);
            }}
            onCreateClick={handleCreateOpen}
            onDeleteClick={setDeleteTarget}
          />
        )}
      </div>

      {/* Shared components */}
      {userId && (
        <CreateTaskDialog
          key={createOpen ? `open-${initialStatus}` : "closed"}
          open={createOpen}
          onOpenChange={setCreateOpen}
          userId={userId}
          initialStatus={initialStatus}
        />
      )}

      <TaskDetailSheet
        key={editingTask?._id}
        task={editingTask}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingTask(null);
        }}
      />

      <DeleteAlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        taskId={deleteTarget}
      />

      <TaskDrawer
        task={drawerTask}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setDrawerTask(null);
        }}
      />
    </div>
  );
}

function TasksLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
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
