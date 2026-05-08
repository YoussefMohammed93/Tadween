import { v, Validator } from "convex/values";
import { UserJSON } from "@clerk/nextjs/server";
import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";

// Get the current user
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Store/Sync current user from client
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userAttributes = {
      email: identity.email ?? "",
      clerkUserId: identity.subject,
      imageUrl: identity.pictureUrl,
      firstName: identity.givenName,
      lastName: identity.familyName,
    };

    const user = await userByClerkUserId(ctx, identity.subject);
    if (user === null) {
      return await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
      return user._id;
    }
  },
});

// Upsert user from Clerk
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      email: data.email_addresses[0].email_address,
      clerkUserId: data.id,
      imageUrl: data.image_url ?? undefined,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
    };

    const user = await userByClerkUserId(ctx, data.id);

    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

// Delete user from Clerk
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkUserId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`User with clerkUserId ${clerkUserId} not found`);
    }
  },
});

// Helper functions
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);

  if (!userRecord) throw new Error("Can't get current user");

  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return null;

  return await userByClerkUserId(ctx, identity.subject);
}

async function userByClerkUserId(ctx: QueryCtx, clerkUserId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}
