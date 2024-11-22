
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { useBotStore } from "./store";
import { columns } from "./components/columns";
import { BotForm } from "./components/form";
import DataTable from "@/components/ui/data-table";
import { NoStateComponent } from "./components/no-state";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";

export default function BotDashboard() {
  const { workspace } = useWorkspace();
  const {
    bots,
    loading,
    error,
    fetchBots,
    onOpenCreateForm,
  } = useBotStore();

  const alreadyMounted = useRef(false);
  useEffect(() => {
    if (!alreadyMounted.current && workspace) {
      fetchBots(workspace.id);
      alreadyMounted.current = true;
    }
  }, [workspace, fetchBots]);

  if (loading) return <LoadingPageSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!bots.length && !loading) return <NoStateComponent />;

  return (
    <>
      <div className="container mx-auto p-4">
        <DataTable
          columns={columns}
          data={bots}
          searchField="name"
          toolBarChildren={
            <Button onClick={onOpenCreateForm}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Bot
            </Button>
          }
        />
      </div>

      {/* CRUD Form Dialog */}
      <BotForm />
    </>
  );
}