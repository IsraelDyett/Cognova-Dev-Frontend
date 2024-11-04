"use client";
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { useSourcesStore } from './store'
import { WorkspacePageProps } from '@/types';
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import DataTable from '@/components/ui/data-table'
import { sourcesColumns } from './_components/columns'
import { AddSourceForm } from './_components/add-source-form'
import { FileText, Globe, Plus, AlertCircle } from 'lucide-react'
import SourcesPageSkeleton from '@/components/skeletons/sources-page';

export const sourceTypes = [
    { type: 'pdf', icon: FileText, label: 'PDF', contentType: 'application/pdf' },
    { type: 'website', icon: Globe, label: 'Website', contentType: 'text/html' },
]

export default function SourcesPage(props: WorkspacePageProps) {
    const { toast } = useToast()
    const { 
        sources,
        isLoading,
        error,
        isAddDialogOpen,
        fetchSources,
        setIsAddDialogOpen
    } = useSourcesStore()

    React.useEffect(() => {
        const botId = props.params.bot_uuid
        fetchSources(botId).catch(() => {
            toast({
                variant: "destructive",
                title: "Error loading sources",
                description: "Please try again or contact support if the problem persists."
            })
        })
    }, [])

    const handleAddSource = () => {
        // Implement source addition logic
    }

    if (isLoading) {
        return <SourcesPageSkeleton/>
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sources</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Source
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Source</DialogTitle>
                        </DialogHeader>
                        <AddSourceForm onSubmit={handleAddSource} />
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={sourcesColumns}
                data={sources}
                searchField="url"
            />
        </div>
    )
}