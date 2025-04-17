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
import { useBusinessStore } from "../store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicSelector from "@/components/ui/dynamic-selector";
import { useWorkspace } from "../../../../contexts/workspace-context";
import { useRouter } from "next/navigation";
import DialogForm from "./dialog-form";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = [
	{ id: "retail_store", name: "Retail Store" },
	{ id: "electronics_store", name: "Electronics Store" },
	{ id: "clothing_apparel", name: "Clothing & Apparel" },
	{ id: "furniture_store", name: "Furniture Store" },
	{ id: "jewelry_store", name: "Jewelry Store" },
	{ id: "sporting_goods", name: "Sporting Goods" },
	{ id: "toys_games", name: "Toys & Games" },
	{ id: "books_stationery", name: "Books & Stationery" },
	{ id: "home_improvement", name: "Home Improvement" },
	{ id: "beauty_cosmetics", name: "Beauty & Cosmetics" },
	{ id: "food_delivery", name: "Food Delivery" },
	{ id: "grocery_store", name: "Grocery Store" },
	{ id: "pharmacy", name: "Pharmacy" },
	{ id: "pet_supplies", name: "Pet Supplies" },
	{ id: "auto_parts", name: "Auto Parts" },
	{ id: "arts_crafts", name: "Arts & Crafts" },
	{ id: "music_instruments", name: "Musical Instruments" },
	{ id: "office_supplies", name: "Office Supplies" },
	{ id: "garden_outdoor", name: "Garden & Outdoor" },
	{ id: "electronics_repair", name: "Electronics Repair" },
];

const formSchema = z.object({
	workspaceId: z.string().min(1, "Required"),
	name: z.string().min(1, "Required"),
	type: z.string().min(1, "Required"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
	workspaceId: "",
	name: "",
	type: "",
	description: "",
};

export function BusinessForm({
	wrapInDialog = true,
	onComplete,
}: {
	wrapInDialog?: boolean;
	onComplete?: (data?: any) => void;
}) {
	const { createBusiness, updateBusiness, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } =
		useBusinessStore();
	const { refreshCurrentWorkspace, workspace } = useWorkspace();
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateBusiness(initialCrudFormData.id, values).then(() =>
					refreshCurrentWorkspace(),
				);
			} else {
				// @ts-ignore
				await createBusiness(values).then((business) => {
					onCloseCrudForm();
					if (onComplete) {
						onComplete(business);
					} else {
						refreshCurrentWorkspace();
						router.push(
							`/${workspace?.name}/businesses/${business.id}/bots?open=true&then=products`,
						);
					}
				});
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	};
	useEffect(() => {
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				workspaceId: initialCrudFormData?.workspaceId || "",
				name: initialCrudFormData?.name || "",
				type: initialCrudFormData?.type || "",
				description: initialCrudFormData?.description || "",
			});
		} else if (isOpenCrudForm || onComplete) {
			form.reset(defaultValues);
			form.setValue("workspaceId", workspace?.id || "");
		}
	}, [initialCrudFormData, isOpenCrudForm, form, workspace?.id, onComplete]);

	const formContent = (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid gap-4 grid-cols-1 md:grid-cols-2"
			>
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

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						// <DynamicSelector
						// 	form={form}
						// 	idKey="type"
						// 	items={BUSINESS_TYPES}
						// 	itemKey="id"
						// 	itemLabelKey="name"
						// 	label="Business Type"
						// 	description="Select the type of business you operate"
						// />

						<input
							{...field}
							type="text"
							placeholder="Enter Your Organization Type"
							value={field.value || ""}
							onChange={field.onChange}
							className="input-classname" // replace with your desired styling
						/>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="col-span-full">
							<FormLabel helpText="This description helps AI to personalize how it communicates with your customers.">
								Description
							</FormLabel>
							<FormControl>
								<Textarea
									disabled={isLoading}
									placeholder="We are a local store that sells electronics..."
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This description helps AI to personalize how it communicates with
								your customers.
							</FormDescription>
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
			title={`${initialCrudFormData ? "Edit" : "Create"} Business`}
			description={`${initialCrudFormData ? "Make changes to the" : "Add a new"} business.`}
		>
			{formContent}
		</DialogForm>
	);
}
