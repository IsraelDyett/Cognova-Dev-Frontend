"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import { WorkspacePageProps } from "@/types";
import { useBotStore } from "@/lib/stores/bot";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import SourcesPageHeader from "./components/header";
import { sourcesColumns } from "./components/columns";
import { AlertCircle, RefreshCcw } from "lucide-react";
import SourcesPageSkeleton from "@/components/skeletons/sources-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page(props: WorkspacePageProps) {
	const [quietLoading, setQuietLoading] = useState(false);
	const { sources, loading, error, fetchSources } = useBotStore();

	const botId = props.params.botId;
	const alreadyMounted = React.useRef(false);
	React.useEffect(() => {
		if (!alreadyMounted.current) {
			fetchSources(botId);
			alreadyMounted.current = true;
		}
	}, []);

	if (loading == "sources") {
		return <SourcesPageSkeleton />;
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-8 relative">
			<SourcesPageHeader />
			<DataTable
				columns={sourcesColumns}
				data={sources}
				searchField="url"
				toolBarChildren={
					<Button
						onClick={() => {
							setQuietLoading(true)
							fetchSources(botId, true).then(() => {
								toast.info("Sources refreshed")
								setQuietLoading(false)
							})
						}}
						className="px-4"
						size={"sm"}
						variant={"outline"}
					>
						<RefreshCcw className={`size-5 ${quietLoading && "animate-spin"}`} />
					</Button>
				}
			/>
		</div>
	);
}
