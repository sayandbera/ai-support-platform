"use client";
import React from "react";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface Props {
  orgId: string;
}
export const WidgetView = ({ orgId }: Props) => {
  return (
    <main className="flex flex-col h-full w-full min-h-screen overflow-hidden rounded-xl border bg-muted">
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">How can I help you?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">Widget View: {orgId}</div>
      <WidgetFooter />
    </main>
  );
};
