"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useProductStore } from "./store";
import { columns } from "./components/columns";
import DataTable from "@/components/ui/data-table";
import { ProductForm } from "./components/form";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { NoStateComponent } from "@/app/(app)/(workspace)/components/no-state";
import { WorkspacePageProps } from "@/types";

export default function ProductDashboard(props: WorkspacePageProps) {
	const { products, loading, error, fetchProducts, onOpenCreateForm } = useProductStore();

	useEffect(() => {
		if (props.params.businessId) {
			fetchProducts(props.params.businessId);
		}
	}, [props, fetchProducts]);

	useEffect(() => {
		if (props.searchParams.open) {
			onOpenCreateForm();
		}
	}, [props.searchParams.open, onOpenCreateForm]);

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
			<ProductForm wrapInDialog={true} />
		</section>
	);
}
