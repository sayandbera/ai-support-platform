import Image from "next/image";
import React from "react";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2 opacity-50">
        <Image alt="logo" height={40} width={40} src={"/logo.svg"} />
        <p className="font-semibold text-lg">AI Support Platform</p>
      </div>
    </div>
  );
};
