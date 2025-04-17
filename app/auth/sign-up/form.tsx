"use client";
import { z } from "zod";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormAction,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import posthog from "posthog-js";
import { getMessage } from "@/lib/lang";
import { SignUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { signUp } from "@/lib/actions/server/auth";
import { exclude } from "@/lib/utils";

export default function SignUpForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
		const { success, data: result, error } = await signUp(data);
		if (success) {
			const user = exclude(result.user, "password");
			posthog.identify(result.user.id, { email: result.user.email, name: result.user.name });
			posthog.capture("Signed Up", { ...user });
			toast.success(getMessage(result.action));
			//router.push(searchParams.get("redirect") || "/onboarding"); //https://app.cognova.io/onboarding
			window.location.href = "https://buy.stripe.com/8wMcPK1lm4E3436dQQ";
		} else {
			console.error(error);
			form.setError("email", {
				type: "custom",
				message: getMessage(error),
			});
		}
	};
	useEffect(() => {
		if (submitButtonRef.current && submitButtonRef.current.disabled) {
			submitButtonRef.current.disabled = false;
		}
	}, []);
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									showPasswordToggle
									type="password"
									autoComplete="new-password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mt-4">
					<FormAction
						disabled
						ref={submitButtonRef}
						className="[&>div>svg]:!size-5"
						variant="expandIcon"
						Icon={ArrowRightIcon}
						iconPlacement="right"
					>
						Create account
					</FormAction>
				</div>
				<p className="text-end text-sm mt-2">
					Already have an account?{" "}
					<Link
						href={`/auth/sign-in?redirect=${searchParams.get("redirect") ?? "/"}`}
						className="font-semibold"
					>
						Sign in
					</Link>
				</p>
			</form>
		</Form>
	);
}
