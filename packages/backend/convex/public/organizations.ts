import { v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

export const validate = action({
  args: {
    orgId: v.string(),
  },
  handler: async (_, args) => {
    try {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: args.orgId,
      });

      return { valid: true };
    } catch {
      return { valid: false, reason: "Organization not found" };
    }
  },
});
