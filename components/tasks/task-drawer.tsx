"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Tick01Icon,
  Calendar01Icon,
  Clock01Icon,
  Layers01Icon,
  Tag01Icon,
  TextIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import type { Task } from "@/convex/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PriorityBadge } from "./priority-badge";

interface TaskDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDrawer({ task, open, onOpenChange }: TaskDrawerProps) {
  if (!task) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-none!">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={20}
                    className="text-primary"
                  />
                </div>
                <div>
                  <DrawerTitle className="text-start font-heading text-xl font-bold">
                    {task.title}
                  </DrawerTitle>
                  <DrawerDescription className="text-xs">
                    Quick view of task details
                  </DrawerDescription>
                </div>
              </div>
              <PriorityBadge priority={task.priority} />
            </div>
          </DrawerHeader>

          <div className="p-6 flex flex-col gap-6">
            {/* Description */}
            <div className="flex flex-col gap-2">
              <h4 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <HugeiconsIcon icon={TextIcon} size={14} />
                Description
              </h4>
              <p className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border border-border leading-relaxed">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border border-border">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={12}
                    className="text-blue-500"
                  />
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit capitalize border-none px-0 font-semibold bg-transparent! text-sm",
                    task.status === "todo" && "text-orange-500",
                    task.status === "in-progress" && "text-blue-500",
                    task.status === "done" && "text-green-500",
                  )}
                >
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border border-border">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <HugeiconsIcon
                    icon={Layers01Icon}
                    size={12}
                    className="text-purple-500"
                  />
                  Type
                </span>
                <Badge
                  variant="outline"
                  className="w-fit capitalize bg-transparent! border-none px-0 font-semibold text-sm text-foreground"
                >
                  {task.type}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border border-border">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    size={12}
                    className="text-rose-500"
                  />
                  Due Date
                </span>
                <div className="font-mono text-sm font-semibold text-foreground">
                  {task.dueDate || "Not set"}
                </div>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <HugeiconsIcon
                    icon={Tag01Icon}
                    size={14}
                    className="text-primary"
                  />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-xs font-bold border border-primary/10 flex items-center gap-1.5"
                    >
                      <HugeiconsIcon icon={Tag01Icon} size={10} />#{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="border-t border-border bg-muted/10">
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-xl">
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
