"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PlusSignIcon,
  TextIcon,
  Layers01Icon,
  Alert01Icon,
  Clock01Icon,
  Calendar01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { useMutation } from "convex/react";
import { DEFAULT_TAGS } from "./tag-config";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Textarea } from "@/components/ui/textarea";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialStatus?: "todo" | "in-progress" | "done";
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  userId,
  initialStatus,
}: CreateTaskDialogProps) {
  const createTask = useMutation(api.tasks.create);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"daily" | "monthly" | "yearly">("daily");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">(
    initialStatus ?? "todo",
  );
  const [dueDate, setDueDate] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("daily");
    setPriority("medium");
    setStatus(initialStatus ?? "todo");
    setDueDate("");
    setSelectedTags([]);
    setCustomTag("");
  };

  const toggleTag = (tagLabel: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel)
        ? prev.filter((t) => t !== tagLabel)
        : [...prev, tagLabel],
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();

    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTag("");
      toast.success(`Tag "${tag}" added`);
    }
  };

  // Validation: All fields are required as per user request
  const isValid =
    title.trim() !== "" && dueDate !== "" && selectedTags.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(
        "Please fill in all required fields (Title, Date, Priority, Status, and at least one Tag)",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        priority,
        status,
        dueDate,
        tags: selectedTags,
        userId,
      });

      resetForm();
      onOpenChange(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={16}
                className="text-primary"
              />
            </div>
            <DialogTitle className="font-heading text-lg font-semibold">
              New Task
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-title"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              <HugeiconsIcon icon={TextIcon} size={12} color="currentColor" />
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg h-10 border-input/60"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-desc"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              <HugeiconsIcon icon={TextIcon} size={12} color="currentColor" />
              Description
            </label>
            <Textarea
              id="task-desc"
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg min-h-[70px] resize-none border-input/60"
            />
          </div>

          {/* Grid Layout for Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
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
                value={type}
                onValueChange={(v) =>
                  setType(v as "daily" | "monthly" | "yearly")
                }
              >
                <SelectTrigger className="rounded-lg h-10 text-sm border-input/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
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
                value={priority}
                onValueChange={(v) =>
                  setPriority(v as "low" | "medium" | "high" | "urgent")
                }
              >
                <SelectTrigger className="rounded-lg h-10 text-sm border-input/60">
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
                value={status}
                onValueChange={(v) =>
                  setStatus(v as "todo" | "in-progress" | "done")
                }
              >
                <SelectTrigger className="rounded-lg h-10 text-sm border-input/60">
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
              <label
                htmlFor="task-due"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={12}
                  color="currentColor"
                />
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-lg h-10 text-sm border-input/60"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon icon={Tag01Icon} size={12} color="currentColor" />
              Tags <span className="text-destructive">*</span>
            </label>

            {/* Quick Tags Grid */}
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-input/40 bg-muted/20">
              {DEFAULT_TAGS.map((tag) => {
                const isActive = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-input/60 hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <HugeiconsIcon
                      icon={tag.icon}
                      size={13}
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

            {/* Selected Custom Tags List (optional but good for visibility) */}
            {selectedTags.filter(
              (t) => !DEFAULT_TAGS.some((dt) => dt.label === t),
            ).length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {selectedTags
                  .filter((t) => !DEFAULT_TAGS.some((dt) => dt.label === t))
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg px-6"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || isSubmitting}
              className="gap-1.5 rounded-lg px-6"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={14}
                color="currentColor"
              />
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
