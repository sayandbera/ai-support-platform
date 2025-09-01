"use client";

import React from "react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";
import { toast } from "sonner";
import { CheckCircleIcon, PhoneIcon, XCircleIcon } from "lucide-react";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4 font-medium">
              Phone Number
            </TableHead>
            <TableHead className="px-6 py-4 font-medium text-center">
              Name
            </TableHead>
            <TableHead className="px-6 py-4 font-medium text-right">
              Status
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
                    Loading phone numbers...
                  </TableCell>
                </TableRow>
              );
            }

            if (phoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={3}>
                    No phone numbers configured
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumbers.map((phoneNumber) => (
              <TableRow className="hover:bg-muted/50" key={phoneNumber.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {phoneNumber.number || "Not configured"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  {phoneNumber.name || "Unnamed"}
                </TableCell>

                <TableCell className="px-6 py-4 text-right">
                  <Badge
                    variant={
                      phoneNumber.status === "active"
                        ? "default"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {phoneNumber.status === "active" ? (
                      <CheckCircleIcon className="mr-1 size-3" />
                    ) : (
                      <XCircleIcon className="mr-1 size-3" />
                    )}
                    {phoneNumber.status || "Unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
