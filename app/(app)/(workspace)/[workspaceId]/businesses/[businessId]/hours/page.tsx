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

export default function HourDashboard() {
	const { businessId } = useParams();
	const { hours, loading, error, fetchHours, onOpenCreateForm } = useHourStore();

	const alreadyMounted = useRef(false);
	useEffect(() => {
		if (!alreadyMounted.current && businessId) {
			fetchHours(`${businessId}`);
			alreadyMounted.current = true;
		}
	}, [businessId, fetchHours]);

	if (loading) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;
	return (
		<>
			<div className="container mx-auto p-4">
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
			</div>
			<HourForm />
		</>
	);
}
