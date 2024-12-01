import React from "react";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";

export default function AuthLayout({
	children,
	classNames,
}: {
	children: React.ReactNode;
	classNames?: string;
}) {
	return (
		<section
			className={cn(
				"flex h-[100dvh] flex-col items-center justify-center w-full px-6",
				classNames,
			)}
		>
			<div className="mx-auto w-full max-w-[25rem] z-10 overflow-hidden">{children}</div>
			<DotPattern
				className={cn(
					"[mask-image:radial-gradient(circle_at_center,white,transparent)]  bg-gradient-to-r from-yellow-50 to-pink-50",
				)}
			/>
		</section>
	);
}
