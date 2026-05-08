"use client";

import {
  FilterIcon,
  Sun01Icon,
  Calendar01Icon,
  CalendarCheckIn01Icon,
  GridViewIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TaskType = "all" | "daily" | "monthly" | "yearly";
type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

interface TaskFiltersProps {
  activeType: TaskType;
  onTypeChange: (type: TaskType) => void;
  activeStatuses: Status[];
  onStatusToggle: (status: Status) => void;
  activePriorities: Priority[];
  onPriorityToggle: (priority: Priority) => void;
  hideStatus?: boolean;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const typeIcons: Record<string, typeof Sun01Icon> = {
  all: GridViewIcon,
  daily: Sun01Icon,
  monthly: Calendar01Icon,
  yearly: CalendarCheckIn01Icon,
};

export function TaskFilters({
  activeType,
  onTypeChange,
  activeStatuses,
  onStatusToggle,
  activePriorities,
  onPriorityToggle,
  hideStatus = false,
}: TaskFiltersProps) {
  const hasActiveFilters =
    activeStatuses.length > 0 || activePriorities.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border">
      {/* Type tabs */}
      <Tabs
        value={activeType}
        onValueChange={(v) => onTypeChange(v as TaskType)}
      >
        <TabsList className="h-9 gap-0.5 bg-input/30 p-1 border">
          {(["all", "daily", "monthly", "yearly"] as const).map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="text-xs px-3 h-7 gap-1.5 capitalize data-[state=active]:bg-background"
            >
              <HugeiconsIcon
                icon={typeIcons[type]}
                size={13}
                color="currentColor"
              />
              {type === "all" ? "All" : type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-5 w-px bg-border" />

      {/* Status filter */}
      {!hideStatus && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeStatuses.length > 0 ? "default" : "outline"}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium rounded-lg"
              >
                <HugeiconsIcon
                  icon={FilterIcon}
                  size={13}
                  color="currentColor"
                />
                Status
                {activeStatuses.length > 0 && (
                  <span className="ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-md bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground px-1">
                    {activeStatuses.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel className="text-xs font-semibold">
                Filter by status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={activeStatuses.includes(opt.value)}
                  onCheckedChange={() => onStatusToggle(opt.value)}
                  className="text-xs"
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-5 w-px bg-border" />
        </>
      )}

      {/* Priority filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={activePriorities.length > 0 ? "default" : "outline"}
            size="sm"
            className="h-8 gap-1.5 text-xs font-medium rounded-lg"
          >
            <HugeiconsIcon icon={FilterIcon} size={13} color="currentColor" />
            Priority
            {activePriorities.length > 0 && (
              <span className="ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-md bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground px-1">
                {activePriorities.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel className="text-xs font-semibold">
            Filter by priority
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {priorityOptions.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={activePriorities.includes(opt.value)}
              onCheckedChange={() => onPriorityToggle(opt.value)}
              className="text-xs"
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 border border-border text-destructive hover:text-destructive"
          onClick={() => {
            activeStatuses.forEach((s) => onStatusToggle(s));
            activePriorities.forEach((p) => onPriorityToggle(p));
          }}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} color="currentColor" />
          Clear
        </Button>
      )}
    </div>
  );
}
