"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Main() {
  const tasks = useQuery(api.tasks.get);

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <ul>
        {tasks?.map((task) => (
          <li
            key={task._id}
            className={cn(
              `text-center text-5xl py-5 ${task.isCompleted && "text-green-500"}`,
            )}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </main>
  );
}
