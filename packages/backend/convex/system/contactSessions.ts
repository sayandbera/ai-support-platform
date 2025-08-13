import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

// Internal convex function, use only inside a convex function
export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});
