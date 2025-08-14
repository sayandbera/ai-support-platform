import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    orgId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.orgId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        // TODO: Later modify to widget settings initial message
        content: "Hello, how can I help you today?",
      },
    });

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: session._id,
      orgId: args.orgId,
      status: "unresolved",
      threadId: threadId,
    });

    return conversationId;
  },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect session",
      });
    }

    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status,
    };
  },
});

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("asc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;
        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: {
            cursor: null,
            numItems: 1,
          },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          orgId: conversation.orgId,
          threadId: conversation.threadId,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationWithLastMessage,
    };
  },
});
