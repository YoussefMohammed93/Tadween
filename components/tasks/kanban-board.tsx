"use client";

import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useMutation } from "convex/react";
import type { Task } from "@/convex/tasks";
import { KanbanCard } from "./kanban-card";
import { arrayMove } from "@dnd-kit/sortable";
import { api } from "@/convex/_generated/api";
import { KanbanColumn } from "./kanban-column";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface KanbanBoardProps {
  tasks: Task[];
  onEditClick: (task: Task) => void;
  onViewClick: (task: Task) => void;
  onCreateClick: (status?: Task["status"]) => void;
  onDeleteClick: (id: Id<"tasks">) => void;
}

const columns = [
  { id: "todo", label: "Todo", color: "oklch(0.65 0.18 55)" },
  {
    id: "in-progress",
    label: "In Progress",
    color: "oklch(0.546 0.245 262.881)",
  },
  { id: "done", label: "Done", color: "oklch(0.55 0.15 145)" },
] as const;

export function KanbanBoard({
  tasks,
  onEditClick,
  onViewClick,
  onCreateClick,
  onDeleteClick,
}: KanbanBoardProps) {
  const moveToColumn = useMutation(api.tasks.moveToColumn);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      setLocalTasks(tasks ?? []);
    }
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function onDragStart({ active }: DragStartEvent) {
    isDragging.current = true;
    setActiveTask(localTasks.find((t) => t._id === active.id) ?? null);
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = localTasks.find((t) => t._id === activeId);
    const overTask = localTasks.find((t) => t._id === overId);

    if (!activeTask) return;

    // Dragging over a column (not a card)
    const overIsColumn = ["todo", "in-progress", "done"].includes(overId);

    if (overIsColumn) {
      if (activeTask.status !== overId) {
        setLocalTasks((prev) =>
          prev.map((t) =>
            t._id === activeId ? { ...t, status: overId as Task["status"] } : t,
          ),
        );
      }
      return;
    }

    // Dragging over another card — reorder within or across columns
    if (overTask && activeTask.status !== overTask.status) {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t._id === activeId ? { ...t, status: overTask.status } : t,
        ),
      );
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    isDragging.current = false;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const task = localTasks.find((t) => t._id === activeId);
    if (!task) return;

    const overIsColumn = ["todo", "in-progress", "done"].includes(overId);

    let newTasks = [...localTasks];

    if (!overIsColumn) {
      const overTask = localTasks.find((t) => t._id === overId);
      if (overTask) {
        const oldIndex = localTasks.findIndex((t) => t._id === activeId);
        const newIndex = localTasks.findIndex((t) => t._id === overId);
        newTasks = arrayMove(localTasks, oldIndex, newIndex);
        setLocalTasks(newTasks);
      }
    }

    // Persist to Convex
    const columnTasks = newTasks.filter((t) => t.status === task.status);
    const order = columnTasks.findIndex((t) => t._id === task._id);

    moveToColumn({
      id: task._id,
      status: task.status,
      order: order,
    });
    
    toast.success("Task moved successfully");
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex gap-4 w-full min-h-[calc(100vh-250px)]">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            className="flex-1 min-w-[300px]"
            tasks={localTasks.filter((t) => t.status === col.id)}
            onEditClick={onEditClick}
            onViewClick={onViewClick}
            onCreateClick={() => onCreateClick(col.id as Task["status"])}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            isOverlay
            onEditClick={onEditClick}
            onViewClick={onViewClick}
            onDeleteClick={onDeleteClick}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
