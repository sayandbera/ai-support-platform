import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // we have added the org_id field inside the convex JWT template in clerk
    const orgId = identity.org_id as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found!",
      });
    }

    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
      .unique();

    return widgetSettings;
  },
});

export const upsert = mutation({
  args: {
    greetMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    vapiSettings: v.object({
      assistantId: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // we have added the org_id field inside the convex JWT template in clerk
    const orgId = identity.org_id as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found!",
      });
    }

    const existingWidgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
      .unique();

    if (existingWidgetSettings) {
      await ctx.db.patch(existingWidgetSettings._id, {
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggestions,
        vapiSettings: args.vapiSettings,
      });
    } else {
      await ctx.db.insert("widgetSettings", {
        orgId,
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggestions,
        vapiSettings: args.vapiSettings,
      });
    }
  },
});
