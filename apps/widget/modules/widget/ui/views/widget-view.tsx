"use client";

import React from "react";
// import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";

interface Props {
  orgId: string;
}
export const WidgetView = ({ orgId }: Props) => {
  return (
    <main className="flex flex-col h-full w-full min-h-screen overflow-hidden rounded-xl border bg-muted">
      <WidgetAuthScreen />
      {/* <div className="flex flex-1">Widget View: {orgId}</div> */}
      {/* <WidgetFooter /> */}
    </main>
  );
};
