"use client";
import { z } from "zod";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
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
import { getMessage } from "@/lib/lang";
import { SignInSchema } from "@/lib/zod";
import { ArrowRightIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { validateEmail } from "@/lib/utils";
import AuthServerActions from "@/lib/actions/server/auth";

export default function SignInForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
	});
	useWatch({
		control: form.control,
		name: "email",
	});
	const isEmailValid = validateEmail(form.getValues().email);

	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		const result = await AuthServerActions.signIn(data);
		if (result.success) {
			toast.success(getMessage(result.data.action));
			router.push(searchParams.get("redirect") ?? "/");
		} else {
			console.error(result.data);
			form.setError("email", {
				type: "custom",
				message: getMessage(`${result.data}`),
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
				<AnimatePresence>
					{isEmailValid && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.4 }}
						>
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
						</motion.div>
					)}
				</AnimatePresence>
				<div className="mt-4">
					<FormAction
						disabled
						ref={submitButtonRef}
						className="[&>div>svg]:!size-5"
						variant="expandIcon"
						Icon={ArrowRightIcon}
						iconPlacement="right"
					>
						Sign In
					</FormAction>
				</div>
				<p className="text-end text-sm mt-2">
					Don&apos;t have an account?{" "}
					<Link
						href={`/auth/sign-up?redirect=${searchParams.get("redirect") ?? "/"}`}
						className="font-semibold"
					>
						Sign up
					</Link>
				</p>
			</form>
		</Form>
	);
}
