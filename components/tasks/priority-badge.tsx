"use client";

import {
  Alert01Icon,
  ArrowUp01Icon,
  RemoveSquareIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";

type Priority = "low" | "medium" | "high" | "urgent";

const priorityConfig: Record<
  Priority,
  {
    label: string;
    icon: typeof Alert01Icon;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  urgent: {
    label: "Urgent",
    icon: Alert01Icon,
    bgColor: "oklch(0.577 0.245 27.325 / 0.12)",
    textColor: "oklch(0.577 0.245 27.325)",
    borderColor: "oklch(0.577 0.245 27.325 / 0.25)",
  },
  high: {
    label: "High",
    icon: ArrowUp01Icon,
    bgColor: "oklch(0.65 0.18 55 / 0.12)",
    textColor: "oklch(0.55 0.16 55)",
    borderColor: "oklch(0.65 0.18 55 / 0.25)",
  },
  medium: {
    label: "Medium",
    icon: RemoveSquareIcon,
    bgColor: "oklch(0.78 0.15 85 / 0.15)",
    textColor: "oklch(0.5 0.1 85)",
    borderColor: "oklch(0.78 0.15 85 / 0.3)",
  },
  low: {
    label: "Low",
    icon: ArrowDown01Icon,
    bgColor: "oklch(0.556 0 0 / 0.08)",
    textColor: "oklch(0.556 0 0)",
    borderColor: "oklch(0.556 0 0 / 0.15)",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];

  return (
    <Badge
      variant="outline"
      className="inline-flex items-center gap-1 rounded-md h-[22px] text-[11px] font-semibold px-2 py-0 leading-none whitespace-nowrap border"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
    >
      <HugeiconsIcon icon={config.icon} size={11} color="currentColor" />
      {config.label}
    </Badge>
  );
}
