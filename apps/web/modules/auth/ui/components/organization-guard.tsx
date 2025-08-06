"use client";

import { useOrganization } from "@clerk/nextjs";
import React from "react";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectionView } from "../views/org-selection-view";

interface Props {
  children: React.ReactNode;
}

export const OrganizationGuard = ({ children }: Props) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <AuthLayout>
        <p>Loading...</p>
      </AuthLayout>
    );
  }

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
