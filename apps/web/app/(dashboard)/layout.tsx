import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => (
  <AuthGuard>
    <OrganizationGuard>{children}</OrganizationGuard>
  </AuthGuard>
);

export default Layout;
