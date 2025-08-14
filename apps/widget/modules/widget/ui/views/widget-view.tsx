"use client";

import React from "react";
// import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
import { WidgetInboxScreen } from "../screens/widget-Inbox-screen";

interface Props {
  orgId: string;
}

export const WidgetView = ({ orgId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen orgId={orgId} />,
    error: <WidgetErrorScreen />,
    selection: <WidgetSelectionScreen />,
    voice: <p>TODO: Voice</p>,
    auth: <WidgetAuthScreen />,
    inbox: <WidgetInboxScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="flex flex-col h-full w-full min-h-screen overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
