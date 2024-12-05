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
	hasDelivery: false,
	acceptsReturns: false,
	hasWarranty: false,
};
export function BusinessForm() {
	const { createBusiness, updateBusiness, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } =
		useBusinessStore();
	const { refreshCurrentWorkspace, workspace } = useWorkspace();

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
				await createBusiness(values).then(() => refreshCurrentWorkspace());
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
				name: initialCrudFormData?.name || "",
				type: initialCrudFormData?.type || "",
				description: initialCrudFormData?.description || "",
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
			form.setValue("workspaceId", workspace?.id || "");
		}
	}, [initialCrudFormData, isOpenCrudForm, form, workspace?.id]);

	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"3xl"}>
				<DialogHeader>
					<DialogTitle>{initialCrudFormData ? "Edit" : "Create"} Business</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"} business.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 grid-cols-2">
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
							name="type"
							render={({ field }) => (
								<DynamicSelector
									form={form}
									idKey="type"
									items={BUSINESS_TYPES}
									itemKey="id"
									itemLabelKey="name"
									label="Business Type"
									description="Select the type of business you operate"
								/>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className=" col-span-full">
									<FormLabel helpText="This description helps AI to personalize how it communicates with your customers.">
										Description
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={isLoading}
											placeholder="Enter description"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This description helps AI to personalize how it communicates
										with your customers.
									</FormDescription>
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
