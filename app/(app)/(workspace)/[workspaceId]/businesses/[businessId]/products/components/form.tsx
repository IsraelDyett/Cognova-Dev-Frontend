"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site";

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
	const defaultValues = useMemo(
		() => ({
			stock: "IN_STOCK",
			isActive: true,
			images: [],
		}),
		[],
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const params = useSearchParams();
	const router = useRouter();
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateProduct(initialCrudFormData.id, values);
			} else {
				// @ts-ignore
				await createProduct(values).then(() => {
					if (params.get("preview") && params.get("then")) {
						router.push(`${siteConfig.domains.root}/chats/${params.get("preview")}`);
					}
				});
			}
			onCloseCrudForm();
			setUploadedImages([]);
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
		if (isOpenCrudForm) {
			if (initialCrudFormData) {
				form.reset({
					...initialCrudFormData,
					categoryId: initialCrudFormData.categoryId || "",
					stock: initialCrudFormData.stock || "IN_STOCK",
					description: initialCrudFormData.description || undefined,
				});
				setUploadedImages(
					initialCrudFormData.images.map((image, index) => ({
						fileName: `Image ${index + 1}`,
						fileUrl: image,
					})),
				);
			} else {
				setUploadedImages([]);
				form.reset(defaultValues);
			}
		}
	}, [
		initialCrudFormData,
		isOpenCrudForm,
		form,
		categories.length,
		fetchCategories,
		defaultValues,
	]);
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
									<FormLabel>Description (Optional)</FormLabel>
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
									<FormLabel helpText="Enter the quantity available. Select 'IN_STOCK' if you always have this product ready at your location">
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
									<FormLabel
										helpText="Product availability status when active can be retrieved in the conversation"
										className="text-base"
									>
										Available
									</FormLabel>
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
