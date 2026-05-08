"use client";

import { useState } from "react";
import {
  ArrowDown01Icon,
  Sun01Icon,
  Calendar01Icon,
  CalendarCheckIn01Icon,
} from "@hugeicons/core-free-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Task } from "@/convex/tasks";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { TaskRow } from "@/components/tasks/task-row";
import { TaskEmptyState } from "@/components/tasks/task-empty-state";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onEditClick: (task: Task) => void;
  onCreateClick: () => void;
}

const priorityOrder: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const sectionIcons: Record<string, typeof Sun01Icon> = {
  Daily: Sun01Icon,
  Monthly: Calendar01Icon,
  Yearly: CalendarCheckIn01Icon,
};

const sectionColors: Record<string, { text: string; bg: string }> = {
  Daily: {
    text: "oklch(0.65 0.18 55)",
    bg: "oklch(0.65 0.18 55 / 0.1)",
  },
  Monthly: {
    text: "oklch(0.488 0.243 264)",
    bg: "oklch(0.488 0.243 264 / 0.08)",
  },
  Yearly: {
    text: "oklch(0.55 0.16 155)",
    bg: "oklch(0.55 0.16 155 / 0.08)",
  },
};

export function TaskSection({
  title,
  tasks,
  onEditClick,
  onCreateClick,
}: TaskSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const sortedTasks = [...tasks].sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const icon = sectionIcons[title] ?? Sun01Icon;
  const colors = sectionColors[title] ?? sectionColors.Daily;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2.5 py-2.5 px-1 group cursor-pointer">
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          color="currentColor"
          className={`text-muted-foreground transition-transform duration-150 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: colors.bg }}
        >
          <HugeiconsIcon icon={icon} size={14} style={{ color: colors.text }} />
        </div>
        <span className="font-heading text-[13px] font-semibold tracking-wide text-foreground">
          {title}
        </span>
        <Badge
          variant="secondary"
          className="rounded-md text-[10px] font-bold px-1.5 py-0 h-[18px] leading-none tabular-nums"
        >
          {tasks.length}
        </Badge>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {sortedTasks.length === 0 ? (
          <TaskEmptyState onCreateClick={onCreateClick} />
        ) : (
          <div className="flex flex-col gap-3 pt-1 pl-6">
            {sortedTasks.map((task) => (
              <TaskRow key={task._id} task={task} onEditClick={onEditClick} />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
