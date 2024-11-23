"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { useBusinessStore } from "./store";
import { columns } from "./components/columns/business";
import { BusinessForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import { NoStateComponent } from "./components/no-state";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";

export default function BusinessDashboard() {
	const { workspace } = useWorkspace();
	const { businesses, loading, error, fetchBusinesses, onOpenCreateForm } = useBusinessStore();

	useEffect(() => {
		if (workspace) {
			fetchBusinesses(workspace.id);
		}
	}, [workspace, fetchBusinesses]);

	if (loading) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<div className="container mx-auto p-4">
				{businesses.length === 0 && !loading ? (
					<NoStateComponent />
				) : (
					<DataTable
						columns={columns}
						data={businesses}
						searchField="name"
						toolBarChildren={
							<Button onClick={onOpenCreateForm}>
								<PlusIcon className="mr-2 h-4 w-4" /> Add New Business
							</Button>
						}
					/>
				)}
			</div>
			<BusinessForm />
		</>
	);
}
