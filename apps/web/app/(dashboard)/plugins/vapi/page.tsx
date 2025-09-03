import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { VapiView } from "@/modules/plugins/ui/views/vapi-view";
import { Protect } from "@clerk/nextjs";
import React from "react";

const VapiPage = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiView />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
};

export default VapiPage;
