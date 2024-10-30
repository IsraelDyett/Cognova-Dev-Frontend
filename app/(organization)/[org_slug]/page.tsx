import React from 'react';
// import { notFound } from 'next/navigation';
import { CreateBot } from '../_components/create-bot';
// import { isUserInOrganization } from '../actions';
// import { authUser } from '@/app/auth/actions';

export const revalidate = 10;
export default async function OrganizationOverviewPage({ params }: { params: { org_slug: string } }) {
    // const user = await authUser()
    // if (!user) {
    //     notFound();
    // }
    // const organization = await isUserInOrganization(user?.id, params.org_slug)
    // if (!organization.success) {
    //     notFound();
    // }
    return (
        <div className='flex-1 h-full justify-center flex items-center'>
            <CreateBot />
        </div>
    );
}