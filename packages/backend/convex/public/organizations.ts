import { v } from "convex/values";
import { action } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) throw new Error("CLERK_SECRET_KEY must be set");
const clerkClient = createClerkClient({ secretKey: clerkSecretKey });

export const validate = action({
  args: {
    orgId: v.string(),
  },
  handler: async (_, args) => {
    try {
      await clerkClient.organizations.getOrganization({
        organizationId: args.orgId,
      });

      return { valid: true };
    } catch {
      return { valid: false, reason: "Organization not found" };
    }
  },
});
