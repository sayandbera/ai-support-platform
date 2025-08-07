import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default Layout;
