"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(workspace)/contexts/workspace-context";
import { useBusinessStore } from "./store";
import { columns } from "./components/columns/business";
import { BusinessForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import { NoStateComponent } from "./components/no-state";

export default function BusinessDashboard() {
  const { workspace } = useWorkspace();
  const { businesss, loading, error, fetchBusinesss, isOpenCrudForm, onOpenCreateForm } =
    useBusinessStore();

  useEffect(() => {
    if (workspace) {
      fetchBusinesss(workspace.id);
    }
  }, [workspace, fetchBusinesss]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!businesss.length && !isOpenCrudForm) return <NoStateComponent />;

  return (
    <>
      <div className="container mx-auto p-4">
        <DataTable
          columns={columns}
          data={businesss}
          searchField="name"
          toolBarChildren={
            <Button onClick={onOpenCreateForm}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Business
            </Button>
          }
        />
      </div>

      {/* CRUD Form Dialog */}
      <BusinessForm />
    </>
  );
}
