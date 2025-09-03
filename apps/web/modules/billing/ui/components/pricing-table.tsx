import React from "react";
import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

export const PricingTable = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <ClerkPricingTable
        forOrganizations={true}
        appearance={{
          elements: {
            pricingTableCard: "shadow-none! border! rounded-xl!",
            pricingTableCardHeader: "bg-background!",
            pricingTableCardBody: "bg-background!",
            pricingTableCardFooter: "bg-background!",
            pricingTableCardFeatures: "bg-background!",
          },
        }}
      />
    </div>
  );
};
