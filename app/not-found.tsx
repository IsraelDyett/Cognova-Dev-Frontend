import React from "react";
import Link from "next/link";
import AuthLayout from "./auth/layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<AuthLayout classNames="bg-background">
			<div className="relative z-10 text-center">
				<h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
				<h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
				<p className="text-xl text-gray-600 mb-8">
					Oops! It seems our AI couldn&apos;t locate this page.
				</p>
				<Button asChild>
					<Link href="/">Back to Home</Link>
				</Button>
			</div>
		</AuthLayout>
	);
}
