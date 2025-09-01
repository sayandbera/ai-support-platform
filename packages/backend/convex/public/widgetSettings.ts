import { v } from "convex/values";
import { query } from "../_generated/server";

export const getByOrgId = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
      .unique();

    return widgetSettings;
  },
});
