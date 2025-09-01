"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiAssistants } from "../../hooks/use-vapi-data";
import { BotIcon } from "lucide-react";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading } = useVapiAssistants();

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 font-medium">Assistants</TableHead>
            <TableHead className="px-6 py-4 font-medium">Model</TableHead>
            <TableHead className="px-6 py-4 font-medium">
              First Message
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    className="px-6 py-8 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    Loading assistants...
                  </TableCell>
                </TableRow>
              );
            }

            if (assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={3}>
                    No assistants configured
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant) => (
              <TableRow className="hover:bg-muted/50" key={assistant.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {assistant.name || "Unnamed Assistant"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <span className="text-sm">
                    {assistant.model?.model || "Not configured"}
                  </span>
                </TableCell>

                <TableCell className="max-w-xs px-6 py-4">
                  <p className="truncate text-muted-foreground text-sm">
                    {assistant.firstMessage || "No greeting configured"}
                  </p>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
