
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useBusinessLocationStore } from "./store";
import { columns } from "./components/columns";
import { BusinessLocationForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { NoStateComponent } from "./components/no-state";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { useParams } from "next/navigation";

export default function BusinessLocationDashboard() {
  const { businessId } = useParams();
  const {
    businesslocations,
    loading,
    error,
    fetchBusinessLocations,
    onOpenCreateForm,
  } = useBusinessLocationStore();

  const alreadyMounted = useRef(false);
  useEffect(() => {
    if (!alreadyMounted.current && businessId) {
      fetchBusinessLocations(`${businessId}`);
      alreadyMounted.current = true;
    }
  }, [businessId, fetchBusinessLocations]);

  if (loading) return <LoadingPageSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!businesslocations.length && !loading) return <NoStateComponent />;

  return (
    <>
      <div className="container mx-auto p-4">
        <DataTable
          columns={columns}
          data={businesslocations}
          searchField="name"
          toolBarChildren={
            <Button onClick={onOpenCreateForm}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New BusinessLocation
            </Button>
          }
        />
      </div>

      {/* CRUD Form Dialog */}
      <BusinessLocationForm />
    </>
  );
}