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
import { WorkspacePageProps } from "@/types";

const BotForm = dynamic(() => import("./components/form").then((mod) => mod.BotForm));

export default function BotDashboard(props: WorkspacePageProps) {
	const { bots, loading, error, fetchBots, onOpenCreateForm } = useBotStore();

	const alreadyMounted = useRef(false);
	useEffect(() => {
		if (!alreadyMounted.current && props.params.businessId) {
			fetchBots(props.params.businessId);
			alreadyMounted.current = true;
		}
	}, [props, fetchBots]);

	useEffect(() => {
		if (props.searchParams.open) {
			onOpenCreateForm();
		}
	}, [props.searchParams.open, onOpenCreateForm]);

	if (["bots", "initial"].includes(loading)) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<section>
				{bots.length === 0 && loading === "none" ? (
					<NoStateComponent title="Bot" onOpenCreateForm={onOpenCreateForm} />
				) : (
					<DataTable
						columns={columns}
						data={bots}
						searchField="name"
						tableRowLink={`/${props.params.workspaceId}/businesses/${props.params.businessId}/bots/{id}`}
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
