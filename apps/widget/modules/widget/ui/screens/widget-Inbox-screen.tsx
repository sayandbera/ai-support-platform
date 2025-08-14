"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  orgIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { ArrowLeftIcon } from "lucide-react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const orgId = useAtomValue(orgIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(orgId || "")
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 10,
    });

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="transparent"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
        {conversations.results.map((conversation) => (
          <Button
            className="h-20 w-full justify-between"
            key={conversation._id}
            variant="outline"
            onClick={() => {
              setConversationId(conversation._id);
              setScreen("chat");
            }}
          >
            <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
              <div className="flex w-full items-center justify-between gap-x-2">
                <p className="text-muted-foreground text-xs">Chat</p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(
                    new Date(conversation.lastMessage?._creationTime ?? 0)
                  )}
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-x-2">
                <p className="text-sm truncate">
                  {conversation.lastMessage?.text}
                </p>
                <ConversationStatusIcon
                  status={conversation.status}
                  className="shrink-0"
                />
              </div>
            </div>
          </Button>
        ))}

        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>

      <WidgetFooter />
    </>
  );
};
