import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

// Define an agent similarly to the AI SDK
export const supportAgent = new Agent(components.agent, {
  chat: google.chat("gemini-2.5-flash"),
  instructions: `You are a helpful customer support agent. Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or requests human support explicitly.`,
});
