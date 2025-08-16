import { Doc } from "@workspace/backend/_generated/dataModel";
import React from "react";
import { Hint } from "@workspace/ui/components/hint";
import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface Props {
  status: Doc<"conversations">["status"];
  disabled?: boolean;
  onClick: () => void;
}

export const ConversationStatusButton = ({
  status,
  disabled,
  onClick,
}: Props) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="tertiary"
        >
          <CheckIcon />
          Resolved
        </Button>
      </Hint>
    );
  } else if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="destructive"
        >
          <ArrowUpIcon />
          Escalated
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Mark as escalated">
      <Button disabled={disabled} onClick={onClick} size="sm" variant="warning">
        <ArrowRightIcon />
        Unresolved
      </Button>
    </Hint>
  );
};
