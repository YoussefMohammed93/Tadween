"use client";

import { useMemo } from "react";
import type { Task } from "@/convex/tasks";
import { TaskSection } from "@/components/tasks/task-section";

interface TaskListProps {
  tasks: Task[];
  activeType: "all" | "daily" | "monthly" | "yearly";
  onEditClick: (task: Task) => void;
  onViewClick: (task: Task) => void;
  onCreateClick: () => void;
}

const sectionTypes = ["daily", "monthly", "yearly"] as const;
const sectionLabels: Record<string, string> = {
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function TaskList({
  tasks,
  activeType,
  onEditClick,
  onViewClick,
  onCreateClick,
}: TaskListProps) {
  // Group by type
  const grouped = useMemo(() => {
    const groups: Record<string, Task[]> = {
      daily: [],
      monthly: [],
      yearly: [],
    };
    for (const task of tasks) {
      groups[task.type].push(task);
    }
    return groups;
  }, [tasks]);

  // Which sections to show
  const visibleSections =
    activeType === "all"
      ? sectionTypes
      : sectionTypes.filter((t) => t === activeType);

  return (
    <div className="flex flex-col gap-6">
      {/* Sections */}
      <div className="flex flex-col gap-6">
        {visibleSections.map((type) => (
          <TaskSection
            key={type}
            title={sectionLabels[type]}
            tasks={grouped[type]}
            onEditClick={onEditClick}
            onViewClick={onViewClick}
            onCreateClick={onCreateClick}
          />
        ))}
      </div>
    </div>
  );
}
