"use client"
import { SiGithub } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signIn } from "next-auth/react"
import SignUpForm from "./form";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl">Sign in to Cognova AI</CardTitle>
        <CardDescription>
        Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignUpForm/>
      </CardContent>
    </Card>
  )
}
