// import { Card } from '@/components/card'
import React from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            {/* <Card className="w-full max-w-sm"> */}
                {children}
            {/* </Card> */}
        </div>
    )
}