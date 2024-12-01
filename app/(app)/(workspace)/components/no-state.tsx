"use client";
import { Button } from "@/components/ui/button";
import { useBotStore } from "@/lib/stores/bot";
import { PlusIcon } from "lucide-react";

export function NoStateComponent({ onOpenCreateForm, title}: {onOpenCreateForm: () => void, title: string}) {
	return (
		<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
			<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
				<h3 className="mt-4 text-lg font-semibold">No Record</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					Add your first {title.toLowerCase()} to get started.
				</p>
				<Button onClick={onOpenCreateForm}>
					<PlusIcon className="mr-2 h-4 w-4" /> Add {title}
				</Button>
			</div>
		</div>
	);
}
