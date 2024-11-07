import React from 'react';
import { notFound } from 'next/navigation';
import { WorkspacePageProps } from '@/types';

export const revalidate = 10;
export default async function BotPreviewPage(props: WorkspacePageProps) {
    const bot = {}
    if (!bot) {
        notFound();
    }
    return (
        <div className='flex-1 h-full justify-center flex items-center'>
              <h2>BOT: {props.params.botId}</h2>
        </div>
    );
}