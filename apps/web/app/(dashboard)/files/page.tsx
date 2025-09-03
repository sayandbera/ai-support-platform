import { FilesView } from "@/modules/files/ui/views/files-view";
import React from "react";
import { Protect } from "@clerk/nextjs";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const FilesPage = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
};

export default FilesPage;
