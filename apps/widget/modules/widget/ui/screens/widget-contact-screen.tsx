"use client";

import React, { useState } from "react";
import { WidgetHeader } from "../components/widget-header";
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  MicIcon,
  MicOffIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
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
import Link from "next/link";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!phoneNumber) return;

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          <p>Contact Us</p>
        </div>
      </WidgetHeader>

      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <div className="flex items-center justify-center rounded-full border bg-background p-3">
          <PhoneIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Available 24/7</p>
        <p className="font-bold text-2xl">{phoneNumber}</p>
      </div>

      <div className="border-t bg-background p-4">
        <div className="grid grid-cols-2 items-center gap-x-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleCopy}
            variant="outline"
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2 size-4 text-primary" />
                <span className="text-primary">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 size-4" /> Copy Number
              </>
            )}
          </Button>
          <Button asChild className="w-full" size="lg">
            <Link href={`tel:${phoneNumber}`}>
              <PhoneIcon />
              Call Now
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
