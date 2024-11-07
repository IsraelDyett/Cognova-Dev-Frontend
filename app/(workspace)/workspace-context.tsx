'use client';
import { Workspace, Plan } from '@prisma/client';
import { useParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getWorkspace } from './actions';
import { debug } from '@/lib/utils';

interface WorkspaceWithPlan extends Workspace {
    plan: Plan
}

const DefaultProps = {
    workspace: null as WorkspaceWithPlan | null
};

export interface WorkspaceContextType {
    workspace: WorkspaceWithPlan | null;
}

const WorkspaceContext = createContext<WorkspaceContextType>(DefaultProps);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { workspaceId } = useParams();
    const alreadyMounted = React.useRef(false)
    const [workspace, setWorkspace] = useState<WorkspaceWithPlan | null>(null);


    const fetchWorkspace = async () => {
        if (workspaceId) {
            debug("[A-SYNC-FUNC] {WORKSPACE-CONTEXT} FETCH WORKSPACE")
            const retrievedWorkspace = await getWorkspace(`${workspaceId}`, true);
            if (retrievedWorkspace) {
                setWorkspace(retrievedWorkspace);
            }
        }
    };
    useEffect(() => {
        if (!alreadyMounted.current && workspaceId) {
            fetchWorkspace().catch((err) => {
                console.error('Error fetching workspace:', err);
                alreadyMounted.current = false
            });
            alreadyMounted.current = true
        }
    }, [workspaceId]);

    return (
        <WorkspaceContext.Provider value={{ workspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = (): WorkspaceContextType => {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error('useWorkspace must be used within an WorkspaceProvider');
    }
    return context;
};