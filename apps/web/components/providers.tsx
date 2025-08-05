"use client";

import * as React from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ConvexProvider client={convexClient}>{children}</ConvexProvider>
    </NextThemesProvider>
  );
}
