import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../../../lib/constants";

// Define an agent similarly to the AI SDK
export const supportAgent = new Agent(components.agent, {
  chat: google.chat("gemini-2.5-flash"),
  instructions: SUPPORT_AGENT_PROMPT,
});
