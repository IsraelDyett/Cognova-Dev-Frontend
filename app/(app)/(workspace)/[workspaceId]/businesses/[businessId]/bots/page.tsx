"use client";

import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import { columns } from "./components/columns";
import DataTable from "@/components/ui/data-table";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { useBotStore } from "@/lib/stores/bot";
import dynamic from "next/dynamic";
import { NoStateComponent } from "@/app/(app)/(workspace)/components/no-state";

const BotForm = dynamic(() => import("./components/form").then((mod) => mod.BotForm));

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
			<section>
				{bots.length === 0 && !loading ? (
					<NoStateComponent title="Bot" onOpenCreateForm={onOpenCreateForm} />
				) : (
					<DataTable
						columns={columns}
						data={bots}
						searchField="name"
						tableRowLink={`/${workspace?.name}/businesses/{businessId}/bots/{id}`}
						toolBarChildren={
							<Button onClick={onOpenCreateForm}>
								<PlusIcon className="mr-2 h-4 w-4" /> Add New Bot
							</Button>
						}
					/>
				)}
			</section>
			<Suspense>
				<BotForm />
			</Suspense>
		</>
	);
}
