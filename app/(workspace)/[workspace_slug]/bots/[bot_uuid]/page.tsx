import React from 'react';
import { notFound } from 'next/navigation';

export const revalidate = 10;
export default async function BotPreviewPage({ params }: { params: { bot_uuid: number } }) {
    const bot = {}
    if (!bot) {
        notFound();
    }
    return (
        <div className='flex-1 h-full justify-center flex items-center'>
              <h2>BOT: {params.bot_uuid}</h2>
        </div>
    );
}