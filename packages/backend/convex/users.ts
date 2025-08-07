import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated");
    }

    const orgID = identity.org_id;
    if (!orgID) {
      throw new Error("Missing organization");
    }

    const user = await ctx.db.insert("users", {
      name: args.name,
    });

    return user;
  },
});
