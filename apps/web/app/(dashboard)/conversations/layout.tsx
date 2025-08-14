import { ConversationsLayout } from "@/modules/dashboard/ui/layouts/conversations-layout";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => (
  <ConversationsLayout>{children}</ConversationsLayout>
);

export default Layout;
