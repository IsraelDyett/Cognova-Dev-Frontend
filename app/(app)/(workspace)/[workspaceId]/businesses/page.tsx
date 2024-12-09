"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import { useBusinessStore } from "./store";
import { columns } from "./components/columns";
import { BusinessForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { NoStateComponent } from "../../components/no-state";

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
			<section>
				{businesses.length === 0 && !loading ? (
					<NoStateComponent title="Business" onOpenCreateForm={onOpenCreateForm} />
				) : (
					<DataTable
						columns={columns}
						data={businesses}
						tableRowLink={`/${workspace?.name}/businesses/{id}`}
						searchField="name"
						toolBarChildren={
							<Button onClick={onOpenCreateForm}>
								<PlusIcon className="mr-2 h-4 w-4" /> Add New Business
							</Button>
						}
					/>
				)}
			</section>
			<BusinessForm />
		</>
	);
}
