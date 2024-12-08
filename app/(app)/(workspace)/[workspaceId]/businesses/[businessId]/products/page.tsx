"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import { useProductStore } from "./store";
import { columns } from "./components/columns";
import DataTable from "@/components/ui/data-table";
import { useParams } from "next/navigation";
import { ProductForm } from "./components/form";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { NoStateComponent } from "@/app/(app)/(workspace)/components/no-state";

export default function ProductDashboard() {
	const { businessId } = useParams();
	const { workspace } = useWorkspace();
	const { products, loading, error, fetchProducts, onOpenCreateForm } = useProductStore();

	useEffect(() => {
		if (workspace && businessId) {
			fetchProducts(`${businessId}`);
		}
	}, [workspace, fetchProducts, businessId]);

	if (loading) return <LoadingPageSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<section>
			{products.length === 0 && !loading ? (
				<NoStateComponent title="Product" onOpenCreateForm={onOpenCreateForm} />
			) : (
				<DataTable
					columns={columns}
					data={products}
					searchField="name"
					toolBarChildren={
						<Button onClick={onOpenCreateForm}>
							<PlusIcon className="mr-2 h-4 w-4" /> Add New Product
						</Button>
					}
				/>
			)}
			<ProductForm />
		</section>
	);
}
