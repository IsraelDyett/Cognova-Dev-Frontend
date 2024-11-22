"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(workspace)/contexts/workspace-context";
import { useProductStore } from "./store";
import { columns } from "./components/columns";
import DataTable from "@/components/ui/data-table";
import { NoStateComponent } from "./components/no-state";
import { useParams } from "next/navigation";
import { ProductForm } from "./components/form";

export default function ProductDashboard() {
  const { businessId } = useParams();
  const { workspace } = useWorkspace();
  const {
    products,
    loading,
    error,
    fetchProducts,
    onOpenCreateForm,
    isOpenCrudForm,
    onCloseCrudForm,
    initialCrudFormData,
  } = useProductStore();

  useEffect(() => {
    if (workspace) {
      fetchProducts(`${businessId}`);
    }
  }, [workspace, fetchProducts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products.length && !isOpenCrudForm) return <NoStateComponent />;

  return (
    <div className="container mx-auto p-4">
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
      <ProductForm />
    </div>
  );
}
