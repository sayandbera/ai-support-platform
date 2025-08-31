import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { upsertSecret } from "../lib/secrets";
import { internal } from "../_generated/api";

/** This function upsert secret to the aws and also upsert secretName to the convex db */
export const upsert = internalAction({
  args: {
    orgId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.orgId}/${args.service}`;

    await upsertSecret(secretName, args.value);

    await ctx.runMutation(internal.system.plugins.upsert, {
      orgId: args.orgId,
      service: args.service,
      secretName,
    });

    return { status: "success" };
  },
});
