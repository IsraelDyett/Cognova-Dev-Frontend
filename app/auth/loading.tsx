import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center w-full">
			<Card className="w-full max-w-sm">
				<CardContent className="!p-6">
					<div className="space-y-4">
						<Skeleton className="w-2/5 h-8 rounded" />
						<div className="pt-2 space-y-2">
							<Skeleton className="w-2/6 h-4 rounded" />
							<Skeleton className="w-full h-8 rounded" />
						</div>
						<div className="pt-2 space-y-2">
							<Skeleton className="w-2/6 h-4 rounded" />
							<Skeleton className="w-full h-8 rounded" />
						</div>
						<div className="pt-4">
							<Skeleton className="w-full h-10 rounded" />
						</div>
						<div className="flex justify-end">
							<Skeleton className="w-3/5 h-4 rounded" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
