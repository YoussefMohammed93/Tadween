"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckListIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

interface TaskEmptyStateProps {
  onCreateClick: () => void;
  message?: string;
}

export function TaskEmptyState({
  onCreateClick,
  message = "No tasks yet",
}: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 rounded-xl border border-dashed border-border/80 bg-muted/10">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 border border-primary/10">
          <HugeiconsIcon
            icon={CheckListIcon}
            size={26}
            className="text-primary"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 px-4 text-center">
        <p className="text-[13px] font-semibold text-foreground/60">
          {message}
        </p>
        <p className="text-xs text-muted-foreground/70 max-w-[200px]">
          Get organized — create your first task and start tracking progress
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 rounded-lg border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
        onClick={onCreateClick}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={14} color="currentColor" />
        Add task
      </Button>
    </div>
  );
}
