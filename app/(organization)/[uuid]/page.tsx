import React from 'react';
import { notFound } from 'next/navigation';

export const revalidate = 10;
export default async function Product({ params }: { params: { uuid: number } }) {
    const organization = {}
    if (!organization) {
        notFound();
    }
    return (
        <>
            <h1>Organization</h1>
        </>
    );
}
