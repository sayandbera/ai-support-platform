import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
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

    // TODO: Check for subscription

    // ctx.runAction is only available within the action context not within the query or mutation
    // to run internalAction within the query or mutation we have to use scheduler to schedule the internal action
    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      orgId,
      service: args.service,
      value: args.value,
    });
  },
});
