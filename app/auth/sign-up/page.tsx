import SignUpForm from "./form";
import { Metadata } from "next";
import OauthButtons from "@/components/ui/oauth-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function SignUpPage() {
	return (
		<Card>
			<CardHeader className="space-y-1 text-center">
				<CardTitle className="text-xl">Create an account</CardTitle>
				<CardDescription>Enter your email below to create your account</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<OauthButtons />
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-2 text-muted-foreground">Or continue with</span>
					</div>
				</div>
				<SignUpForm />
			</CardContent>
		</Card>
	);
}
