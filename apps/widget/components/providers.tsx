"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexReactClient, ConvexProvider } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please add it to your .env.local file."
  );
}

const convexClient = new ConvexReactClient(convexUrl);

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
