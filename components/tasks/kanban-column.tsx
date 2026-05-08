"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import type { Task } from "@/convex/tasks";
import { KanbanCard } from "./kanban-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDroppable } from "@dnd-kit/core";
import { HugeiconsIcon } from "@hugeicons/react";
import { Id } from "@/convex/_generated/dataModel";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface KanbanColumnProps {
  column: {
    id: string;
    label: string;
    color: string;
  };
  tasks: Task[];
  onEditClick: (task: Task) => void;
  onViewClick: (task: Task) => void;
  onCreateClick: () => void;
  onDeleteClick: (id: Id<"tasks">) => void;
  className?: string;
}

export function KanbanColumn({
  column,
  tasks,
  onEditClick,
  onViewClick,
  onCreateClick,
  onDeleteClick,
  className,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-3 rounded-xl p-3 border border-border transition-colors duration-150 min-h-[500px]",
        isOver ? "bg-primary/5 border-primary/30" : "bg-muted/40",
        className,
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Accent dot */}
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: column.color }}
          />
          <span className="font-heading text-sm font-medium">
            {column.label}
          </span>
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
            {tasks.length}
          </Badge>
        </div>
        {/* Quick add button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onCreateClick}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} color="currentColor" />
        </Button>
      </div>

      {/* Accent line */}
      <div
        className="h-[3px] rounded-full w-full"
        style={{ background: column.color }}
      />

      {/* Cards */}
      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 flex-1">
          {tasks.map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onEditClick={onEditClick}
              onViewClick={onViewClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
          {tasks.length === 0 && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-12 px-4 rounded-xl border border-dashed border-border/60 bg-background group/empty hover:bg-background/40 hover:border-primary/30 transition-all duration-200 cursor-pointer"
              onClick={onCreateClick}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover/empty:bg-primary/10 group-hover/empty:text-primary transition-colors">
                <HugeiconsIcon icon={PlusSignIcon} size={18} />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xs font-semibold text-muted-foreground group-hover/empty:text-foreground transition-colors">
                  No tasks yet
                </p>
                <p className="text-[10px] text-muted-foreground/60 leading-tight">
                  Drag here or click to add a task
                </p>
              </div>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
