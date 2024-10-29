import React from 'react';
import { notFound } from 'next/navigation';
import { CreateBot } from '../_components/create-bot';

export const revalidate = 10;
export default async function OrganizationOverviewPage({ params }: { params: { uuid: number } }) {
    const organization = {}
    if (!organization) {
        notFound();
    }
    return (
        <div className='flex-1 h-full justify-center flex items-center'>
              <CreateBot/>
        </div>
    );
}