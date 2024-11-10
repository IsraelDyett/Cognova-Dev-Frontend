"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useSourcesStore } from "./store";
import { WorkspacePageProps } from "@/types";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import SourcesPageHeader from "./_components/header";
import { sourcesColumns } from "./_components/columns";
import { AlertCircle, RefreshCcw } from "lucide-react";
import SourcesPageSkeleton from "@/components/skeletons/sources-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page(props: WorkspacePageProps) {
  const [quietLoading, setQuietLoading] = useState(false);
  const { sources, isLoading, error, fetchSources } = useSourcesStore();

  const fetchSourcesCliently = async (quiet = false) => {
    const botId = props.params.botId;
    setQuietLoading(true);
    await fetchSources(botId, quiet).catch(() => {
      toast.error("Error loading sources", {
        description: "Please try again or contact support if the problem persists.",
      });
    });
    setQuietLoading(false);
    if (quiet) {
      toast.info("Sources refreshed successfully");
    }
  };

  const alreadyMounted = React.useRef(false);
  React.useEffect(() => {
    if (!alreadyMounted.current) {
      fetchSourcesCliently();
      alreadyMounted.current = true;
    }
  }, []);

  if (isLoading) {
    return <SourcesPageSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 relative">
      <SourcesPageHeader />
      <DataTable
        columns={sourcesColumns}
        data={sources}
        searchField="url"
        toolBarChildren={
          <Button
            onClick={() => fetchSourcesCliently(true)}
            className="px-4"
            size={"sm"}
            variant={"outline"}
          >
            <RefreshCcw className={`size-5 ${quietLoading && "animate-spin"}`} />
          </Button>
        }
      />
    </div>
  );
}
