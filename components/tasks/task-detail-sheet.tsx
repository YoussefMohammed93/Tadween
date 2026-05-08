"use client";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Edit01Icon,
  TextIcon,
  Layers01Icon,
  Alert01Icon,
  Clock01Icon,
  Calendar01Icon,
  Tag01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { Task } from "@/convex/tasks";
import { useMutation } from "convex/react";
import { DEFAULT_TAGS } from "./tag-config";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Textarea } from "@/components/ui/textarea";

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  type: "daily" | "monthly" | "yearly";
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  tags: string[];
}

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
}: TaskDetailSheetProps) {
  const updateTaskMutation = useMutation(api.tasks.update);

  // Local state for the form
  // We initialize directly from task. This is safe when using a 'key' on the component
  const [formData, setFormData] = useState<FormData>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    type: task?.type ?? "daily",
    priority: task?.priority ?? "medium",
    status: task?.status ?? "todo",
    dueDate: task?.dueDate ?? "",
    tags: task?.tags ?? [],
  });

  const [customTag, setCustomTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Type-safe field change handler
  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tagLabel: string) => {
    setFormData((prev) => {
      const isRemoving = prev.tags.includes(tagLabel);
      const newTags = isRemoving
        ? prev.tags.filter((t) => t !== tagLabel)
        : [...prev.tags, tagLabel];
      return { ...prev, tags: newTags };
    });
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();

    const tag = customTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      handleFieldChange("tags", [...formData.tags, tag]);
      setCustomTag("");
    }
  };

  const handleSave = async () => {
    if (!task) return;

    // Validation
    if (formData.title.trim() === "") {
      toast.error("Title is required");
      return;
    }
    if (formData.dueDate === "") {
      toast.error("Due date is required");
      return;
    }
    if (formData.tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateTaskMutation({
        taskId: task._id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        tags: formData.tags,
      });

      toast.success("Changes saved successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] flex flex-col overflow-y-auto p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={Edit01Icon}
                size={16}
                className="text-primary"
              />
            </div>
            <SheetTitle className="font-heading text-lg font-semibold text-foreground">
              Task Details
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Form fields */}
        <div className="flex flex-col gap-5 px-6 py-6 flex-1">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon icon={TextIcon} size={12} color="currentColor" />
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="rounded-lg h-10 border-input/60"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon icon={TextIcon} size={12} color="currentColor" />
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="rounded-lg min-h-[90px] resize-none border-input/60"
              placeholder="Add details..."
            />
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <HugeiconsIcon
                  icon={Layers01Icon}
                  size={12}
                  color="currentColor"
                />
                Type <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  handleFieldChange("type", v as FormData["type"])
                }
              >
                <SelectTrigger className="rounded-lg h-10 text-sm w-full border-input/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <HugeiconsIcon
                  icon={Alert01Icon}
                  size={12}
                  color="currentColor"
                />
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(v) =>
                  handleFieldChange("priority", v as FormData["priority"])
                }
              >
                <SelectTrigger className="rounded-lg h-10 text-sm w-full border-input/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={12}
                color="currentColor"
              />
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(v) =>
                handleFieldChange("status", v as FormData["status"])
              }
            >
              <SelectTrigger className="rounded-lg h-10 text-sm w-full border-input/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={12}
                color="currentColor"
              />
              Due Date <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
              className="rounded-lg h-10 text-sm border-input/60"
            />
          </div>

          {/* Tags Section */}
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon icon={Tag01Icon} size={12} color="currentColor" />
              Tags <span className="text-destructive">*</span>
            </label>

            {/* Quick Tags Grid */}
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-input/40 bg-muted/20">
              {DEFAULT_TAGS.map((tag) => {
                const isActive = formData.tags.includes(tag.label);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-input/60 hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <HugeiconsIcon
                      icon={tag.icon}
                      size={12}
                      color={isActive ? "currentColor" : tag.color}
                    />
                    {tag.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleAddCustomTag}
                className="rounded-lg h-9 text-xs border-input/60"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg text-xs"
                onClick={handleAddCustomTag}
              >
                Add
              </Button>
            </div>

            {/* Selected Custom Tags List */}
            {(formData.tags?.filter(
              (t) => !DEFAULT_TAGS.some((dt) => dt.label === t),
            ).length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {formData.tags
                  ?.filter((t) => !DEFAULT_TAGS.some((dt) => dt.label === t))
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-destructive ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/5">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full gap-2 rounded-xl h-11"
          >
            <HugeiconsIcon icon={Tick01Icon} size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
