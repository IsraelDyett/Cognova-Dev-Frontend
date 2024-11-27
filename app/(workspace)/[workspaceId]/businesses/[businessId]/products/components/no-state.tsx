import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { WorkspaceLink } from "@/app/(workspace)/components/link";
import { useProductStore } from "../store";

export function NoStateComponent() {
	const { onOpenCreateForm } = useProductStore();
	return (
		<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
			<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
				<h3 className="mt-4 text-lg font-semibold">No Products added</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					Add your first Product to get started.
				</p>
				<Button onClick={onOpenCreateForm}>
					<PlusIcon className="mr-2 h-4 w-4" /> Add Product
				</Button>
			</div>
		</div>
	);
}
