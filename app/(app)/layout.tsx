import React from "react";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <main className="font-geist-sans">{children}</main>;
}
