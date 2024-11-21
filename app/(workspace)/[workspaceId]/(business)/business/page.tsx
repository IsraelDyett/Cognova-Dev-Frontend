"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(workspace)/workspace-context";
import { useBusinessStore } from "./store";
import { columns } from "./components/list-business-columns";
import DataTable from "@/components/ui/data-table";
import { WorkspaceLink } from "@/app/(workspace)/_components/link";

export default function BusinessDashboard() {
  const { workspace } = useWorkspace();
  const { businesses, loading, error, fetchBusinesses } = useBusinessStore();

  useEffect(() => {
    if (workspace) {
      fetchBusinesses(workspace.id);
    }
  }, [workspace, fetchBusinesses]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <DataTable
        columns={columns}
        data={businesses}
        searchField="name"
        toolBarChildren={
          <Button asChild>
            <WorkspaceLink href="/business/create">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Business
            </WorkspaceLink>
          </Button>
        }
      />
    </div>
  );
}
