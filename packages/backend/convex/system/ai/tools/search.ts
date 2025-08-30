import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import rag from "../rag";
import { generateText } from "ai";
import { supportAgent } from "../agents/supportAgent";
import { SEARCH_INTERPRETER_PROMPT } from "../../../lib/constants";

export const search = createTool({
  description: SEARCH_INTERPRETER_PROMPT,
  args: z.object({
    query: z
      .string()
      .describe(
        "The search query to find relevant information in the knowledge base"
      ),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread ID!";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId }
    );

    if (!conversation) {
      return "Conversation not found!";
    }

    const orgId = conversation.orgId;

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    const contextText = `Found results in ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t != null)
      .join(", ")}. Here is the context : \n\n${searchResult.text}`;

    const response = await generateText({
      model: google.chat("gemini-2.5-flash-lite"),
      messages: [
        {
          role: "system",
          content:
            "You interpret knowledge-base search results and provide helpful, accurate answer to user questions",
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`,
        },
      ],
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });

    return response.text;
  },
});
