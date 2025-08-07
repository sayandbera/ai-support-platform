"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  CreditCardIcon,
  Grid2X2Plus,
  InboxIcon,
  LibraryBigIcon,
  LucideProps,
  Mic,
  SquarePen,
} from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavSectionType = {
  title: string;
  navItems: {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
};
const sidebarNavSections: NavSectionType[] = [
  {
    title: "Customer support",
    navItems: [
      {
        title: "Conversations",
        url: "/conversations",
        icon: InboxIcon,
      },
      {
        title: "Knowledge Base",
        url: "/files",
        icon: LibraryBigIcon,
      },
    ],
  },
  {
    title: "Configurations",
    navItems: [
      {
        title: "Widget Customization",
        url: "/customization",
        icon: SquarePen,
      },
      {
        title: "Integrations",
        url: "/integrations",
        icon: Grid2X2Plus,
      },
      {
        title: "Voice Assistant",
        url: "/plugins/vapi",
        icon: Mic,
      },
    ],
  },
  {
    title: "Account",
    navItems: [
      {
        title: "Plans & Billing",
        url: "/billing",
        icon: CreditCardIcon,
      },
    ],
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === url;
    } else {
      return pathname.startsWith(url);
    }
  };

  return (
    <Sidebar className="group" collapsible="icon">
      {/* Sidebar org header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher
              hidePersonal={true}
              skipInvitationScreen={true}
              appearance={{
                elements: {
                  rootBox: "w-full! h-8!",
                  avatarBox: "size-4!",
                  organizationSwitcherTrigger:
                    "w-full! p-2! rounded-md! justify-start! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:justify-center!",
                  organizationPreview:
                    "gap-2!  group-data-[collapsible=icon]:justify-center!",
                  organizationPreviewTextContainer:
                    "text-xs! font-medium! text-sidebar-foreground! group-data-[collapsible=icon]:hidden!",
                  organizationSwitcherTriggerIcon:
                    "ml-auto! text-sidebar-foreground! group-data-[collapsible=icon]:hidden!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarNavSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar account footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <UserButton
                showName={true}
                appearance={{
                  elements: {
                    rootBox: "w-full! h-8!",
                    userButtonTrigger:
                      "w-full! p-2! rounded-md! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8!",
                    userButtonBox:
                      "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                    userButtonOuterIdentifier:
                      "pl-0! group-data-[collapsible=icon]:hidden",
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
