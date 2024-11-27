import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useBusinessLocationStore } from "../store";

export function NoStateComponent() {
	const { onOpenCreateForm } = useBusinessLocationStore();
	return (
		<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
			<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
				<h3 className="mt-4 text-lg font-semibold">No BusinessLocations added</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					Add your first businesslocation to get started.
				</p>
				<Button onClick={onOpenCreateForm}>
					<PlusIcon className="mr-2 h-4 w-4" /> Add BusinessLocation
				</Button>
			</div>
		</div>
	);
}
