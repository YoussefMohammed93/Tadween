"use client";

import { useState, useMemo } from "react";
import type { Task } from "@/convex/tasks";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskSection } from "@/components/tasks/task-section";
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet";

type TaskType = "all" | "daily" | "monthly" | "yearly";
type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

interface TaskListProps {
  tasks: Task[];
  onCreateClick: () => void;
}

const sectionTypes = ["daily", "monthly", "yearly"] as const;
const sectionLabels: Record<string, string> = {
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function TaskList({ tasks, onCreateClick }: TaskListProps) {
  const [activeType, setActiveType] = useState<TaskType>("all");
  const [activeStatuses, setActiveStatuses] = useState<Status[]>([]);
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setSheetOpen(true);
  };

  // Filter tasks (AND logic)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeType !== "all" && task.type !== activeType) return false;
      if (activeStatuses.length > 0 && !activeStatuses.includes(task.status))
        return false;
      if (
        activePriorities.length > 0 &&
        !activePriorities.includes(task.priority)
      )
        return false;
      return true;
    });
  }, [tasks, activeType, activeStatuses, activePriorities]);

  // Group by type
  const grouped = useMemo(() => {
    const groups: Record<string, Task[]> = {
      daily: [],
      monthly: [],
      yearly: [],
    };
    for (const task of filteredTasks) {
      groups[task.type].push(task);
    }
    return groups;
  }, [filteredTasks]);

  // Which sections to show
  const visibleSections =
    activeType === "all"
      ? sectionTypes
      : sectionTypes.filter((t) => t === activeType);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <TaskFilters
        activeType={activeType}
        onTypeChange={setActiveType}
        activeStatuses={activeStatuses}
        onStatusToggle={handleStatusToggle}
        activePriorities={activePriorities}
        onPriorityToggle={handlePriorityToggle}
      />

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {visibleSections.map((type) => (
          <TaskSection
            key={type}
            title={sectionLabels[type]}
            tasks={grouped[type]}
            onEditClick={handleEditClick}
            onCreateClick={onCreateClick}
          />
        ))}
      </div>

      {/* Detail sheet */}
      <TaskDetailSheet
        key={editingTask?._id}
        task={editingTask}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingTask(null);
        }}
      />
    </div>
  );
}
