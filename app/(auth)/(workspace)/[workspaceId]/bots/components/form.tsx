"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormAction,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBotStore } from "../store";
import type { Bot } from "@prisma/client";

const formSchema = z.object({
	workspaceId: z.string().min(1, "Required"),
	businessId: z.string().optional(),
	name: z.string().min(1, "Required"),
	description: z.string().optional(),
	language: z.string().optional(),
	systemMessage: z.string().optional(),
	placeholderMessage: z.string().optional(),
	welcomeMessage: z.string().optional(),
	starterQuestions: z.array(z.string()),
	modelId: z.string().optional(),
	waPhoneNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
	workspaceId: "",
	businessId: "",
	name: "",
	description: "",
	language: "",
	systemMessage: "",
	placeholderMessage: "",
	welcomeMessage: "",
	starterQuestions: [],
	modelId: "",
	waPhoneNumber: "",
};
export function BotForm() {
	const { createBot, updateBot, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } =
		useBotStore();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateBot(initialCrudFormData.id, values);
			} else {
				// @ts-ignore
				await createBot(values);
			}
			onCloseCrudForm();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};
	useEffect(() => {
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				workspaceId: initialCrudFormData?.workspaceId || "",
				businessId: initialCrudFormData?.businessId || "",
				name: initialCrudFormData?.name || "",
				description: initialCrudFormData?.description || "",
				language: initialCrudFormData?.language || "",
				systemMessage: initialCrudFormData?.systemMessage || "",
				placeholderMessage: initialCrudFormData?.placeholderMessage || "",
				welcomeMessage: initialCrudFormData?.welcomeMessage || "",
				starterQuestions: initialCrudFormData?.starterQuestions || [],
				modelId: initialCrudFormData?.modelId || "",
				waPhoneNumber: initialCrudFormData?.waPhoneNumber || "",
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
		}
	}, [initialCrudFormData, isOpenCrudForm, form]);

	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"3xl"}>
				<DialogHeader>
					<DialogTitle>{initialCrudFormData ? "Edit" : "Create"} Bot</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"} bot.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:grid-cols-4"
					>
						<FormField
							control={form.control}
							name="workspaceId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>WorkspaceId</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter workspaceId"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="businessId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>BusinessId</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter businessId"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Language</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter language"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="md:col-span-2 col-span-full">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											disabled={isLoading}
											placeholder="Enter description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="starterQuestions"
							render={({ field }) => (
								<FormItem className="md:col-span-2 col-span-full">
									<FormLabel>StarterQuestions</FormLabel>
									<FormControl>
										<Textarea
											disabled={isLoading}
											placeholder="Enter starterQuestions"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="placeholderMessage"
							render={({ field }) => (
								<FormItem className="md:col-span-2 col-span-full">
									<FormLabel>PlaceholderMessage</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter placeholderMessage"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="welcomeMessage"
							render={({ field }) => (
								<FormItem className="md:col-span-2 col-span-full">
									<FormLabel>WelcomeMessage</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter welcomeMessage"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="systemMessage"
							render={({ field }) => (
								<FormItem className="col-span-full">
									<FormLabel>SystemMessage</FormLabel>
									<FormControl>
										<Textarea
											disabled={isLoading}
											placeholder="Enter systemMessage"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="modelId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>ModelId</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter modelId"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="waPhoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>WaPhoneNumber</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter waPhoneNumber"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="col-span-full">
							<Button
								disabled={isLoading}
								variant="outline"
								onClick={onCloseCrudForm}
								type="button"
							>
								Cancel
							</Button>
							<FormAction className="w-fit mt-0">
								{initialCrudFormData ? "Save changes" : "Create"}
							</FormAction>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
