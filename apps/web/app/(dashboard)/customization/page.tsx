import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { CustomizationView } from "@/modules/customization/ui/views/customization-view";
import { Protect } from "@clerk/nextjs";
import React from "react";

const CustomizationPage = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationView />
        </PremiumFeatureOverlay>
      }
    >
      <CustomizationView />
    </Protect>
  );
};

export default CustomizationPage;
