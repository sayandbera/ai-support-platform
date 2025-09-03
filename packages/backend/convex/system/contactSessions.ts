import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import {
  AUTO_REFRESH_THRESHOLD_MS,
  SESSION_DURATION_MS,
} from "../lib/constants";

// Internal convex function, use only inside a convex function
export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact Sessions not found!",
      });
    }

    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Contact Sessions expired!",
      });
    }

    const timeRemaining = contactSession.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_MS;

      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });

      return { ...contactSession, expiresAt: newExpiresAt };
    }

    return contactSession;
  },
});
