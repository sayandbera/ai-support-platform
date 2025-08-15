import { ConversationIdView } from "@/modules/dashboard/ui/views/conversation-id-view";
import { Id } from "@workspace/backend/_generated/dataModel";
import React from "react";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}
const ConversationIdPage = async ({ params }: Props) => {
  const { conversationId } = await params;

  return (
    <ConversationIdView
      conversationId={conversationId as Id<"conversations">}
    />
  );
};

export default ConversationIdPage;
