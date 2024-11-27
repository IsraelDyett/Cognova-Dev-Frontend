"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(workspace)/contexts/workspace-context";
import { columns } from "./components/columns";
import { BotForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import { NoStateComponent } from "./components/no-state";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { useBotStore } from "@/lib/stores/bot";

export default function BotDashboard() {
	const { workspace } = useWorkspace();
	const { bots, loading, error, fetchBots, onOpenCreateForm } = useBotStore();

	const alreadyMounted = useRef(false);
	useEffect(() => {
		if (!alreadyMounted.current && workspace) {
			fetchBots(workspace.id);
			alreadyMounted.current = true;
		}
	}, [workspace, fetchBots]);

	if (["bots", "initial"].includes(loading)) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<div className="container mx-auto p-4">
				{bots.length === 0 && !loading ? (
					<NoStateComponent />
				) : (
					<DataTable
						columns={columns}
						data={bots}
						searchField="name"
						toolBarChildren={
							<Button onClick={onOpenCreateForm}>
								<PlusIcon className="mr-2 h-4 w-4" /> Add New Bot
							</Button>
						}
					/>
				)}
			</div>
			<BotForm />
		</>
	);
}
