import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}

export const IntegrationsDialog = ({
  open,
  onOpenChange,
  snippet,
}: IntegrationsDialogProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add the chat-box widget to your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7">
          <div className="space-y-4">
            <div className="text-sm text-accent-foreground">
              1. Copy the following code
            </div>
            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                onClick={handleCopy}
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 size-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <CopyIcon className="size-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-sm text-accent-foreground">
              2. Add the code in your page
            </div>
            <p className="text-muted-foreground text-sm">
              Paste the chat-box code above in your page. You can add it in the
              HTML head section.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
