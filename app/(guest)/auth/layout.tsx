import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="flex h-[100dvh] flex-col items-center justify-center w-full px-6">
			<div className="mx-auto w-full max-w-[25rem] z-10 overflow-hidden">{children}</div>
			<DotPattern
				className={cn(
					"[mask-image:radial-gradient(circle_at_center,white,transparent)]  bg-gradient-to-r from-yellow-50 to-pink-50",
				)}
			/>
		</section>
	);
}
