"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	return (
		<NextThemesProvider {...themeProps}>
			<Toaster position="bottom-right" />
			{children}
		</NextThemesProvider>
	);
}
