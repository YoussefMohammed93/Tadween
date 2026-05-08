import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";

export type Task = Doc<"tasks">;

// List all tasks for the current user, with optional filters
export const list = query({
  args: {
    userId: v.string(),
    type: v.optional(
      v.union(v.literal("daily"), v.literal("monthly"), v.literal("yearly")),
    ),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    let tasks;

    if (args.type) {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", args.userId).eq("type", args.type!),
        )
        .collect();
    } else if (args.status) {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", args.userId).eq("status", args.status!),
        )
        .collect();
    } else {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    }

    // Apply remaining filters client-side within the query
    if (args.status && args.type) {
      // If we filtered by type via index, also filter by status
      tasks = tasks.filter((t) => t.status === args.status);
    }
    if (args.priority) {
      tasks = tasks.filter((t) => t.priority === args.priority);
    }

    return tasks;
  },
});

// Get a single task by ID
export const getById = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    return task;
  },
});

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    type: v.union(
      v.literal("daily"),
      v.literal("monthly"),
      v.literal("yearly"),
    ),
    dueDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      type: args.type,
      dueDate: args.dueDate,
      tags: args.tags,
      order: args.order,
      userId: args.userId,
    });
  },
});

// Update any fields of a task by ID
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent"),
      ),
    ),
    type: v.optional(
      v.union(v.literal("daily"), v.literal("monthly"), v.literal("yearly")),
    ),
    dueDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const { taskId, ...fields } = args;

    // Remove undefined fields so we only patch what was provided
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(taskId, updates);
    return taskId;
  },
});

// Delete a task by ID
export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.delete(args.taskId);
    return args.taskId;
  },
});

// Reorder: update the order field for a task (for future drag-and-drop)
export const reorder = mutation({
  args: {
    taskId: v.id("tasks"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.patch(args.taskId, { order: args.order });
    return args.taskId;
  },
});

// Move a task to a different status column + update order
export const moveToColumn = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    await ctx.db.patch(args.id, { status: args.status, order: args.order });
  },
});
