"use client";
import React from 'react'
import { signIn } from "next-auth/react"
import { SiGithub } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button"

export default function OauthButtons() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Button size={'sm'} className="text-muted-foreground text-sm" variant="outline">
                <SiGithub className="mr-2 h-4 w-4 text-black" />
                GitHub
            </Button>
            <Button size={'sm'} className="text-muted-foreground text-sm" variant="outline" onClick={() => signIn('google')}>
                <FcGoogle className="mr-2 size-4" />
                Google
            </Button>
        </div>
    )
}
