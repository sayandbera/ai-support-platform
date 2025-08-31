import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

export const upsert = internalMutation({
  args: {
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_org_id_and_service", (q) =>
        q.eq("orgId", args.orgId).eq("service", args.service)
      )
      .unique();

    if (existingPlugin) {
      await ctx.db.patch(existingPlugin._id, {
        service: args.service,
        secretName: args.secretName,
      });
    } else {
      await ctx.db.insert("plugins", {
        orgId: args.orgId,
        service: args.service,
        secretName: args.secretName,
      });
    }
  },
});

export const getByOrgIdAndService = internalQuery({
  args: {
    orgId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plugins")
      .withIndex("by_org_id_and_service", (q) =>
        q.eq("orgId", args.orgId).eq("service", args.service)
      )
      .unique();
  },
});
