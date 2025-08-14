import { ArrowRightIcon, CheckIcon } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils.js";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-[#3FB62F]",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowRightIcon,
    bgColor: "bg-yellow-500",
  },
};

export const ConversationStatusIcon = ({
  status,
  className,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full size-5",
        config.bgColor,
        className
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </div>
  );
};
