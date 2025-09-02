import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ContactPanel } from "../components/contact-panel";

type LayoutProps = {
  children: React.ReactNode;
};

export const ConversationsIdLayout = ({ children }: LayoutProps) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel defaultSize={60}>{children}</ResizablePanel>

      <ResizableHandle className="hidden lg:block" />

      <ResizablePanel
        defaultSize={30}
        maxSize={40}
        minSize={20}
        className="hidden lg:block"
      >
        <ContactPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
