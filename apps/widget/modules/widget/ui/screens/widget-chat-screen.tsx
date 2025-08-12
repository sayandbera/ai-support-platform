"use client";

import React from "react";
import { WidgetHeader } from "../components/widget-header";
import { AlertTriangleIcon, ArrowLeftIcon, MenuIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  orgIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);

  const orgId = useAtomValue(orgIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(orgId || "")
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button size="icon" variant="transparent" onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>

        <Button size="icon" variant="transparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>

      <div className="flex flex-1 flex-col gap-y-4 p-4">
        <p>{JSON.stringify(conversation)}</p>
      </div>
    </>
  );
};
