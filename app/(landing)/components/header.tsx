import Link from "next/link";
import Logo from "@/components/logo";
import { User } from "@prisma/client";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { authUser } from "@/lib/actions/server/auth";
import { useEffect, useState } from "react";

export default function Header() {
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		authUser().then((data) => {
			if (data.success) {
				setUser(data.data);
			}
		});
	}, []);
	return (
		<header className="sticky top-0 z-50 w-full border-b backdrop-blur px-6 lg:px-8">
			<div className="container mx-auto flex flex-col sm:flex-row h-fit py-2 items-start sm:items-center justify-between max-w-7xl lg:px-8">
				<Link href="/" className="flex items-center space-x-2">
					<Logo size="sm" />
					<span className="font-bold text-2xl font-sans">
						{siteConfig.applicationName}
					</span>
				</Link>
				<nav className="flex items-center space-x-4 w-full pt-2 sm:pt-0 sm:w-fit ">
					<Button className="grow sm:grow-0" variant="ghost" asChild>
						{user ? (
							<Link href={siteConfig.domains.app + "/auth/sign-out"}>Sign Out</Link>
						) : (
							<Link
								href={
									siteConfig.domains.app +
									"/auth/sign-in?utm_source=landing&utm_medium=header&utm_campaign=login"
								}
							>
								Login
							</Link>
						)}
					</Button>
					<Button className="grow sm:grow-0" asChild>
						{user ? (
							<Link href={siteConfig.domains.app + "/"}>Dashboard</Link>
						) : (
							<Link
								href={
									siteConfig.domains.app +
									"/auth/sign-up?utm_source=landing&utm_medium=header&utm_campaign=sign-up"
								}
							>
								Sign Up
							</Link>
						)}
					</Button>
				</nav>
			</div>
		</header>
	);
}
