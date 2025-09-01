"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { CustomizationForm } from "../components/customization-form";

export const CustomizationView = () => {
  const widgetSettigs = useQuery(api.private.widgetSettings.getOne);
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

  const isLoading = widgetSettigs === undefined || vapiPlugin === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="w-full max-w-screen-md mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
          <p className="text-muted-foreground">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>

        <div className="mt-8">
          <CustomizationForm
            initialData={widgetSettigs}
            hasVapiPlugin={!!vapiPlugin}
          />
        </div>
      </div>
    </div>
  );
};
