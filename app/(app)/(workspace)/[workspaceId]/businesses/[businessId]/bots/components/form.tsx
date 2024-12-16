"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormAction,
	FormControl,
	FormDescription,
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
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import { useRouter, useSearchParams } from "next/navigation";
import DialogForm from "@/app/(app)/(workspace)/[workspaceId]/businesses/components/dialog-form";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof createBotSchema>;

const defaultValues = {
	workspaceId: "",
	businessId: "",
	name: "",
	description: "",
	language: "en",
	starterQuestions: [],
	modelId: "",
};
export function BotForm({
	wrapInDialog = true,
	onComplete,
}: {
	wrapInDialog?: boolean;
	onComplete?: (data?: any) => void;
}) {
	const {
		createBot,
		updateBot,
		onCloseCrudForm,
		initialCrudFormData,
		isOpenCrudForm,
		fetchModels,
		models,
	} = useBotStore();
	const form = useForm<FormValues>({
		resolver: zodResolver(createBotSchema),
		defaultValues,
	});

	const router = useRouter();
	const params = useSearchParams();

	const isLoading = form.formState.isSubmitting;

	const { workspace, refreshCurrentWorkspace } = useWorkspace();
	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateBot(initialCrudFormData.id, values).then(() =>
					refreshCurrentWorkspace(),
				);
			} else {
				// @ts-ignore
				await createBot(values).then((bot) => {
					if (onComplete) {
						onComplete(bot);
					} else {
						refreshCurrentWorkspace();
						if (params.get("then")) {
							router.push(
								`/${workspace?.name}/businesses/${values.businessId}/${params.get("then")}?open=true&then=preview&preview=${bot.id}`,
							);
						}
					}
				});
			}
			onCloseCrudForm();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	useEffect(() => {
		if (models.length == 0) {
			fetchModels();
		}
		if (onComplete) {
			refreshCurrentWorkspace();
		}
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				workspaceId: initialCrudFormData?.workspaceId || "",
				businessId: initialCrudFormData?.businessId || "",
				name: initialCrudFormData?.name || "",
				description: initialCrudFormData?.description || "",
				language: initialCrudFormData?.language || "",
				systemMessage: initialCrudFormData?.systemMessage || "",
				modelId: initialCrudFormData?.modelId || "",
			});
		} else if (isOpenCrudForm || onComplete) {
			form.reset(defaultValues);
			form.setValue("workspaceId", workspace?.id || "");
		}
	}, [
		initialCrudFormData,
		isOpenCrudForm,
		form,
		models.length,
		fetchModels,
		workspace?.id,
		onComplete,
		refreshCurrentWorkspace,
	]);

	const formContent = (
		<Form {...form}>
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
								<Input disabled={isLoading} placeholder="Enter name" {...field} />
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
									placeholder="I am your AI Assistant..."
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This description helps your customers to know about this bot
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DynamicSelector
					label="LLM Model"
					form={form}
					items={models || []}
					itemKey="id"
					labelProps={{
						helpText:
							"Select the AI model that will understand and respond to your customers. Different models have different capabilities and costs.",
					}}
					itemLabelKey="displayName"
					idKey="modelId"
				/>

				<FormField
					control={form.control}
					name="systemMessage"
					render={({ field }) => (
						<FormItem className="col-span-full">
							<FormLabel helpText="Give bot the rules to follow or guidelines">
								Instruct your AI
							</FormLabel>
							<FormControl>
								<Textarea
									disabled={isLoading}
									placeholder="You can do this..., you can't do this..., when asked..do this..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div
					className={cn(
						"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
						"col-span-full gap-2 [&>*]:!w-full sm:[&>*]:!w-fit",
					)}
				>
					{wrapInDialog && (
						<Button
							disabled={isLoading}
							variant="outline"
							onClick={onCloseCrudForm}
							type="button"
						>
							Cancel
						</Button>
					)}
					<FormAction className="w-fit mt-0">
						{initialCrudFormData ? "Save changes" : "Create"}
					</FormAction>
				</div>
			</form>
		</Form>
	);

	if (!wrapInDialog) {
		return formContent;
	}

	return (
		<DialogForm
			isOpenCrudForm={isOpenCrudForm}
			onCloseCrudForm={onCloseCrudForm}
			title={`${initialCrudFormData ? "Edit" : "Create"} Bot`}
			description={`${initialCrudFormData ? "Make changes to the" : "Add a new"} bot.`}
		>
			{formContent}
		</DialogForm>
	);
}
