"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva("relative h-2 w-full overflow-hidden rounded-full", {
	variants: {
		variant: {
			default: "bg-primary/20",
			warning: "bg-warning/20",
			destructive: "bg-destructive/20",
			success: "bg-success/20",
			outline: "border border-input bg-background",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const indicatorVariants = cva("h-full w-full flex-1 transition-all", {
	variants: {
		variant: {
			default: "bg-primary",
			warning: "bg-warning",
			destructive: "bg-destructive",
			success: "bg-success",
			outline: "bg-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface ProgressProps
	extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
		VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
	({ className, value, variant, ...props }, ref) => (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(progressVariants({ variant, className }))}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(indicatorVariants({ variant }))}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	),
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
