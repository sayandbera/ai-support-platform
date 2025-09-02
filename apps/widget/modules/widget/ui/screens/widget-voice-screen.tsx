"use client";

import React from "react";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react";
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
import { useThreadMessages } from "@convex-dev/agent/react";
import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { cn } from "@workspace/ui/lib/utils";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const {
    isConnected,
    isSpeaking,
    transcript,
    startCall,
    endCall,
    isConnecting,
  } = useVapi();

  const onBack = () => {
    setScreen("selection");
  };

  return (
    <>
      <WidgetHeader className="flex items-center gap-x-2">
        <div className="flex items-center gap-x-2">
          <Button size="icon" variant="transparent" onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Voice Chat</p>
        </div>

        {/* <Button size="icon" variant="transparent">
          <MenuIcon />
        </Button> */}
      </WidgetHeader>

      {transcript.length > 0 ? (
        <AIConversation className="h-full flex-1">
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage
                from={message.role}
                key={`${message.role}-${index}-${message.text}`}
              >
                <AIMessageContent>{message.text}</AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      ) : (
        <div className="flex flex-1 h-full  flex-col items-center justify-center gap-y-4">
          <div className="flex items-center justify-center rounded-full border p-3">
            <MicIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Transcript will appear here</p>
        </div>
      )}

      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-4 rounded-full",
                  isSpeaking ? "animate-pulse bg-red-500" : " bg-green-500"
                )}
              ></div>
              <span className="text-muted-foreground text-sm">
                {isSpeaking ? " Assistant Speaking..." : "Listening..."}
              </span>
            </div>
          )}

          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button
                className="w-full"
                size="lg"
                variant="destructive"
                onClick={() => endCall()}
              >
                <MicOffIcon />
                End Call
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={isConnecting}
                size="lg"
                onClick={() => startCall()}
              >
                <MicIcon />
                Start Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
