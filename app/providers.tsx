"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PostHogProvider } from "@/components/posthog-provider";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	return (
		<NextThemesProvider {...themeProps}>
			<Toaster position="bottom-right" />
			<TooltipProvider>
				<PostHogProvider>{children}</PostHogProvider>
			</TooltipProvider>
		</NextThemesProvider>
	);
}
