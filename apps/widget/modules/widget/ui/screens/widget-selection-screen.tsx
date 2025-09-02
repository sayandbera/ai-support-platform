"use client";

import React from "react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import {
  ChevronRightIcon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon,
} from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  hasVapiSecretsAtom,
  orgIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const orgId = useAtomValue(orgIdAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(orgId || "")
  );
  const [isPending, setIsPending] = React.useState(false);

  const createConversation = useMutation(api.public.conversations.create);
  const handleNewConversation = async () => {
    if (!orgId) {
      setScreen("error");
      setErrorMessage("Missing Organization Id");
      return;
    } else if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        orgId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <Button
          className="h-16 w-full justify-between"
          variant="outline"
          disabled={isPending}
          onClick={handleNewConversation}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon />
            <span>Start chat</span>
          </div>
          <ChevronRightIcon />
        </Button>

        {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
          <Button
            className="h-16 w-full justify-between"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setScreen("voice");
            }}
          >
            <div className="flex items-center gap-x-2">
              <MicIcon />
              <span>Start Voice Call</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}

        {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
          <Button
            className="h-16 w-full justify-between"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setScreen("contact");
            }}
          >
            <div className="flex items-center gap-x-2">
              <PhoneIcon />
              <span>Call Us</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}
      </div>

      <WidgetFooter />
    </>
  );
};
