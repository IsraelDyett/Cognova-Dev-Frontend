"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <ShadcnToaster/>
      <Toaster position="bottom-right" />
      {children}
    </NextThemesProvider>
  );
}
