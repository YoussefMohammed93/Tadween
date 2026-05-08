"use client";

import { cn } from "@/lib/utils";
import {
  MoreVerticalIcon,
  Calendar01Icon,
  ViewIcon,
  Tag01Icon,
  Layers01Icon,
  DragDropVerticalIcon,
  Edit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/convex/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PriorityBadge } from "./priority-badge";
import { Id } from "@/convex/_generated/dataModel";

interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
  onEditClick: (task: Task) => void;
  onViewClick: (task: Task) => void;
  onDeleteClick: (id: Id<"tasks">) => void;
}

export function KanbanCard({
  task,
  isOverlay = false,
  onEditClick,
  onViewClick,
  onDeleteClick,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full bg-card border border-border rounded-xl flex flex-col gap-3 cursor-grab active:cursor-grabbing transition-all duration-150 group relative overflow-hidden",
        isDragging && "opacity-40 scale-95",
        isOverlay &&
          "shadow-2xl rotate-1 opacity-95 ring-2 ring-primary/30 border-primary/20",
        !isDragging && "hover:border-primary/30 hover:bg-muted/30",
      )}
    >
      {/* Drag Handle & Content Area */}
      <div {...attributes} {...listeners} className="p-3.5 flex flex-col gap-3">
        {/* Top Header: Priority + Drag Handle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <HugeiconsIcon icon={DragDropVerticalIcon} size={14} />
            </div>
            <PriorityBadge priority={task.priority} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-background/80"
                onClick={(e) => e.stopPropagation()}
              >
                <HugeiconsIcon
                  icon={MoreVerticalIcon}
                  size={14}
                  color="currentColor"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onViewClick(task)}
                className="gap-2 text-xs"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditClick(task)}
                className="gap-2 text-xs"
              >
                <HugeiconsIcon icon={Edit01Icon} size={14} />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive gap-2 text-xs hover:text-destructive!"
                onClick={() => onDeleteClick(task._id)}
              >
                <HugeiconsIcon icon={Delete01Icon} size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[12px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 overflow-hidden">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10 max-w-[120px]"
              >
                <HugeiconsIcon
                  icon={Tag01Icon}
                  size={10}
                  className="shrink-0"
                />
                <span className="truncate">{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer: Date & Type */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={12}
                  color="currentColor"
                />
                <span className="font-mono text-[11px] font-medium">
                  {task.dueDate}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <HugeiconsIcon icon={Layers01Icon} size={12} />
              <span className="text-[11px] font-medium capitalize">
                {task.type}
              </span>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            className="h-7 px-2 rounded-md text-[10px] font-bold gap-1 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onViewClick(task);
            }}
          >
            <HugeiconsIcon icon={ViewIcon} size={12} />
            VIEW
          </Button>
        </div>
      </div>
    </div>
  );
}
