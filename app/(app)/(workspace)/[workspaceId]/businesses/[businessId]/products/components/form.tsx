"use client";

import { useEffect, useRef, useState } from "react";
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
import { useProductStore } from "../store";
import DynamicSelector from "@/components/ui/dynamic-selector";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import MoneyInput from "@/components/ui/money-input";
import ImageUploader from "@/components/image-uploader";

const formSchema = z.object({
	businessId: z.string().cuid(),
	categoryId: z.string().cuid().optional().or(z.literal("")),
	name: z.string().min(1, "Required"),
	description: z.string().optional(),
	price: z.number(),
	stock: z.string().default("IN_STOCK"),
	images: z.array(z.string()).default([]),
	isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
	const {
		createProduct,
		fetchCategories,
		categories,
		updateProduct,
		onCloseCrudForm,
		initialCrudFormData,
		isOpenCrudForm,
	} = useProductStore();
	const [uploadedImages, setUploadedImages] = useState<
		{ fileName: string; fileSize?: number; fileUrl: string }[]
	>([]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			stock: "IN_STOCK",
			isActive: true,
			images: [],
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateProduct(initialCrudFormData.id, values);
			} else {
				// @ts-ignore
				await createProduct(values);
			}
			onCloseCrudForm();
			form.reset();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	const { workspace } = useWorkspace();

	useEffect(() => {
		if (categories.length == 0) {
			fetchCategories();
		}
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				businessId: initialCrudFormData.businessId,
				categoryId: initialCrudFormData?.categoryId || "",
				name: initialCrudFormData.name,
				description: initialCrudFormData?.description || "",
				price: initialCrudFormData.price,
				stock: initialCrudFormData.stock || "",
				images: initialCrudFormData.images,
				isActive: initialCrudFormData.isActive,
			});
			if (initialCrudFormData.images.length > 0) {
				setUploadedImages(
					initialCrudFormData.images.map((image, index) => ({
						fileName: `Image ${index + 1}`,
						fileUrl: image,
					})),
				);
			} else {
				setUploadedImages([]);
			}
		}
	}, [initialCrudFormData, isOpenCrudForm, form, categories.length, fetchCategories]);
	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size="4xl">
				<DialogHeader>
					<DialogTitle>{initialCrudFormData ? "Edit" : "Create"} Product</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"} product.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="gap-4 grid grid-cols-1 sm:grid-cols-2"
					>
						{/* NEEDS TO BE REMOVED */}
						<DynamicSelector
							label="Business"
							form={form}
							items={workspace?.businesses || []}
							itemKey="id"
							itemLabelKey="name"
							idKey="businessId"
						/>
						<DynamicSelector
							label="Category"
							form={form}
							items={categories}
							itemKey="id"
							itemLabelKey="name"
							idKey="categoryId"
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
						<MoneyInput
							name="price"
							placeholder="Enter Price"
							label="Price"
							form={form}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="col-span-full">
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
							name="stock"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										helpText={`How many in stock you can provide. when "IN_STOCK" means products are produced always at your location`}
									>
										Stock
									</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter stock"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-base">Available</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="col-span-full">
							<FormField
								control={form.control}
								name="images"
								render={() => (
									<FormItem>
										<FormLabel>Images</FormLabel>
										<FormControl>
											<ImageUploader
												uploadedImages={uploadedImages}
												setUploadedImages={setUploadedImages}
												form={form}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
