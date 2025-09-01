"use client";

import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import React, { use } from "react";

interface Props {
  searchParams: Promise<{
    orgId: string;
  }>;
}

const Page = ({ searchParams }: Props) => {
  const { orgId } = use(searchParams);

  return <WidgetView orgId={orgId} />;
};

export default Page;
