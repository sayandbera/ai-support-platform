"use client";

import { useOrganization } from "@clerk/nextjs";
import React from "react";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectionView } from "../views/org-selection-view";

interface Props {
  children: React.ReactNode;
}

export const OrganizationGuard = ({ children }: Props) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }

  return <div>{children}</div>;
};
