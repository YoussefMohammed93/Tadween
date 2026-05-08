"use client";

import { toast } from "sonner";
import {
  MoreVerticalIcon,
  Calendar01Icon,
  Delete01Icon,
  Edit01Icon,
  ViewIcon,
  TaskDone01Icon,
  Clock01Icon,
  CircleIcon,
  Alert01Icon,
  ArrowUp01Icon,
  RemoveSquareIcon,
  ArrowDown01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/convex/tasks";
import { useMutation } from "convex/react";
import { DEFAULT_TAGS } from "./tag-config";
import { useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/tasks/priority-badge";

interface TaskRowProps {
  task: Task;
  onEditClick: (task: Task) => void;
  onViewClick: (task: Task) => void;
}

// Config for status styles
const STATUS_STYLES: Record<
  string,
  { label: string; icon: typeof TaskDone01Icon; color: string; bg: string }
> = {
  todo: {
    label: "To Do",
    icon: CircleIcon,
    color: "oklch(0.556 0 0)",
    bg: "oklch(0.556 0 0 / 0.08)",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock01Icon,
    color: "oklch(0.488 0.243 264)",
    bg: "oklch(0.488 0.243 264 / 0.08)",
  },
  done: {
    label: "Done",
    icon: TaskDone01Icon,
    color: "oklch(0.55 0.16 155)",
    bg: "oklch(0.55 0.16 155 / 0.1)",
  },
};

// Config for priority submenu styles
const PRIORITY_MENU_CONFIG: Record<
  string,
  { label: string; icon: typeof Alert01Icon; color: string }
> = {
  urgent: {
    label: "Urgent",
    icon: Alert01Icon,
    color: "oklch(0.577 0.245 27.325)",
  },
  high: {
    label: "High",
    icon: ArrowUp01Icon,
    color: "oklch(0.55 0.16 55)",
  },
  medium: {
    label: "Medium",
    icon: RemoveSquareIcon,
    color: "oklch(0.5 0.1 85)",
  },
  low: {
    label: "Low",
    icon: ArrowDown01Icon,
    color: "oklch(0.556 0 0)",
  },
};

export function TaskRow({ task, onEditClick, onViewClick }: TaskRowProps) {
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const isDone = task.status === "done";
  const currentStatus = STATUS_STYLES[task.status];

  const handleCheckToggle = useCallback(() => {
    const newStatus = isDone ? "todo" : "done";
    updateTask({ taskId: task._id, status: newStatus });
    toast.success(newStatus === "done" ? "Task completed" : "Task reopened");
  }, [isDone, task._id, updateTask]);

  const handleStatusChange = useCallback(
    (status: "todo" | "in-progress" | "done") => {
      updateTask({ taskId: task._id, status });
      toast.success(`Status changed to ${status}`);
    },
    [task._id, updateTask],
  );

  const handlePriorityChange = useCallback(
    (priority: "low" | "medium" | "high" | "urgent") => {
      updateTask({ taskId: task._id, priority });
      toast.success(`Priority changed to ${priority}`);
    },
    [task._id, updateTask],
  );

  const handleDelete = useCallback(() => {
    removeTask({ taskId: task._id });
    setDeleteOpen(false);
    toast.error("Task deleted");
  }, [task._id, removeTask]);

  return (
    <>
      <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-muted/40 transition-all duration-150 cursor-default">
        {/* Checkbox */}
        <Checkbox
          checked={isDone}
          onCheckedChange={handleCheckToggle}
          className="shrink-0 h-[18px] w-[18px] rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          id={`task-check-${task._id}`}
        />

        {/* Title — Opens sheet on click */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onViewClick(task)}
              className={`text-left font-sans text-sm truncate block w-full transition-all duration-150 ${
                isDone
                  ? "line-through text-muted-foreground/60"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {task.title}
            </button>

            {/* Tags display */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {task.tags.map((tagLabel) => {
                  const tagConfig = DEFAULT_TAGS.find(
                    (t) => t.label === tagLabel,
                  );
                  return (
                    <span
                      key={tagLabel}
                      className="inline-flex items-center gap-1 px-1.5 py-0 rounded-md bg-muted/60 text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider border border-border/50"
                    >
                      <HugeiconsIcon
                        icon={tagConfig?.icon || Tag01Icon}
                        size={9}
                        color={tagConfig?.color || "currentColor"}
                      />
                      {tagLabel}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground shrink-0 bg-muted/60 px-2 py-0.5 rounded-md border">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={11}
              color="currentColor"
            />
            {task.dueDate}
          </span>
        )}

        {/* Priority badge */}
        <div className="shrink-0 hidden sm:block">
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Status badge */}
        <Badge
          variant="outline"
          className="shrink-0 hidden md:inline-flex items-center gap-1 rounded-md h-[22px] text-[11px] font-semibold px-2 py-0 leading-none whitespace-nowrap border"
          style={{
            backgroundColor: currentStatus.bg,
            color: currentStatus.color,
            borderColor: `color-mix(in oklch, ${currentStatus.color} 25%, transparent)`,
          }}
        >
          <HugeiconsIcon
            icon={currentStatus.icon}
            size={11}
            color="currentColor"
          />
          {currentStatus.label}
        </Badge>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 transition-all duration-150 shrink-0 hover:bg-[#eee]"
            >
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={16}
                color="currentColor"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onViewClick(task)}
              className="text-xs gap-2"
            >
              <HugeiconsIcon
                icon={ViewIcon}
                size={14}
                className="text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground"
              />
              View details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEditClick(task)}
              className="text-xs gap-2"
            >
              <HugeiconsIcon
                icon={Edit01Icon}
                size={14}
                className="text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground"
              />
              Edit details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Change priority submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs gap-2">
                <span className="flex text-muted-foreground group-data-[state=open]/dropdown-menu-sub-trigger:text-accent-foreground">
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    size={14}
                    color="currentColor"
                  />
                </span>
                Change priority
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {(["urgent", "high", "medium", "low"] as const).map((p) => {
                  const config = PRIORITY_MENU_CONFIG[p];
                  return (
                    <DropdownMenuItem
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className="text-xs gap-2 capitalize"
                    >
                      <span
                        className="flex shrink-0"
                        style={{ color: config.color }}
                      >
                        <HugeiconsIcon
                          icon={config.icon}
                          size={13}
                          className="!text-[inherit]"
                        />
                      </span>
                      {config.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Change status submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs gap-2">
                <span className="flex text-muted-foreground group-data-[state=open]/dropdown-menu-sub-trigger:text-accent-foreground">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={14}
                    color="currentColor"
                  />
                </span>
                Change status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {(["todo", "in-progress", "done"] as const).map((s) => {
                  const config = STATUS_STYLES[s];
                  return (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="text-xs gap-2"
                    >
                      <span
                        className="flex shrink-0"
                        style={{ color: config.color }}
                      >
                        <HugeiconsIcon
                          icon={config.icon}
                          size={13}
                          className="!text-[inherit]"
                        />
                      </span>
                      {config.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              className="text-xs gap-2"
            >
              <HugeiconsIcon
                icon={Delete01Icon}
                size={14}
                className="!text-[inherit]"
              />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{task.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
