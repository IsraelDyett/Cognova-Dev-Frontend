import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center px-6 w-full">
            <div className="mx-auto">
                {children}
            </div>
        </section>
    )
}