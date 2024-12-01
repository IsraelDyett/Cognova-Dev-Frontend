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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicSelector from "@/components/ui/dynamic-selector";
import { createBotSchema } from "@/lib/zod/schemas/bot";
import { useBotStore } from "@/lib/stores/bot";
import { useWorkspace } from "@/app/(workspace)/contexts/workspace-context";

type FormValues = z.infer<typeof createBotSchema>;

const defaultValues = {
	workspaceId: "",
	businessId: "",
	name: "",
	description: "",
	language: "en",
	systemMessage: "You're helpful assistant",
	placeholderMessage: "Ask me anything",
	welcomeMessage: "Hey how can i assist you today",
	starterQuestions: [],
	modelId: "",
	waPhoneNumber: "",
};
export function BotForm() {
	const {
		createBot,
		updateBot,
		onCloseCrudForm,
		initialCrudFormData,
		isOpenCrudForm,
		fetchModels,
		models,
	} = useBotStore();
	const { refreshCurrentWorkspace } = useWorkspace();
	const form = useForm<FormValues>({
		resolver: zodResolver(createBotSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateBot(initialCrudFormData.id, values).then(() =>
					refreshCurrentWorkspace(),
				);
			} else {
				// @ts-ignore
				await createBot(values).then(() => refreshCurrentWorkspace());
			}
			onCloseCrudForm();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};
	const { workspace } = useWorkspace();

	useEffect(() => {
		if (models.length == 0) {
			fetchModels();
		}
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
			form.setValue("workspaceId", workspace?.id || "");
		}
	}, [initialCrudFormData, isOpenCrudForm, form]);

	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"4xl"}>
				<DialogHeader>
					<DialogTitle>{initialCrudFormData ? "Edit" : "Create"} Bot</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"} bot.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					{JSON.stringify(form.formState.errors, null, 2)}
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-1 sm:grid-cols-2 gap-4"
					>
						<DynamicSelector
							label="Business"
							form={form}
							items={workspace?.businesses || []}
							itemKey="id"
							itemLabelKey="name"
							idKey="businessId"
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
						{/* <FormField
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
						/> */}

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

						{/* <FormField
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
						/> */}

						{/* <FormField
							control={form.control}
							name="placeholderMessage"
							render={({ field }) => (
								<FormItem className="md:col-span-1 col-span-full">
									<FormLabel helpText="Placeholder text are shown in the chat input box">Placeholder Message</FormLabel>
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
						/> */}

						<FormField
							control={form.control}
							name="welcomeMessage"
							render={({ field }) => (
								<FormItem className="md:col-span-1 col-span-full">
									<FormLabel>Welcome Message</FormLabel>
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
						<DynamicSelector
							label="LLM Model"
							form={form}
							items={models || []}
							itemKey="id"
							itemLabelKey="displayName"
							idKey="modelId"
						/>

						<FormField
							control={form.control}
							name="systemMessage"
							render={({ field }) => (
								<FormItem className="col-span-full">
									<FormLabel helpText="Give bot the rules to follow or guidelines">
										System Message
									</FormLabel>
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
							name="waPhoneNumber"
							render={({ field }) => (
								<FormItem className="md:col-span-1 col-span-full">
									<FormLabel helpText="When integrating on whatsapp you can chose this bot to handle all message sent to this number">
										Wa Phone Number
									</FormLabel>
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

						<DialogFooter className="col-span-full gap-2 [&>*]:!w-full sm:[&>*]:!w-fit">
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
