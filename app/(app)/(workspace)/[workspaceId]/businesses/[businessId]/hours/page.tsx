"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useHourStore } from "./store";
import { columns } from "./components/columns";
import { HourForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { useParams } from "next/navigation";
import { NoStateComponent } from "@/app/(app)/(workspace)/components/no-state";
import { WorkspacePageProps } from "@/types";

export default function HourDashboard(props: WorkspacePageProps) {
	const { hours, loading, error, fetchHours, onOpenCreateForm } = useHourStore();

	const alreadyMounted = useRef(false);
	useEffect(() => {
		if (!alreadyMounted.current && props.params.businessId) {
			fetchHours(props.params.businessId);
			alreadyMounted.current = true;
		}
	}, [props, fetchHours]);

	if (loading) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;
	return (
		<>
			<section>
				{hours.length === 0 && !loading ? (
					<NoStateComponent title="Hour" onOpenCreateForm={onOpenCreateForm} />
				) : (
					<DataTable
						columns={columns}
						data={hours}
						searchField="name"
						toolBarChildren={
							<Button onClick={onOpenCreateForm}>
								<PlusIcon className="mr-2 h-4 w-4" /> Add New Hour
							</Button>
						}
					/>
				)}
			</section>
			<HourForm />
		</>
	);
}
