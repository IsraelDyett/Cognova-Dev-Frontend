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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBusinessLocationStore } from "../store";
import DynamicSelector from "@/components/ui/dynamic-selector";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import DialogForm from "@/app/(app)/(workspace)/[workspaceId]/businesses/components/dialog-form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	businessId: z.string().cuid(),
	name: z.string().min(1, "Required"),
	address: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	country: z.string().min(1, "Required"),
	phone: z.string().optional(),
	email: z.string().optional(),
	isMain: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
	businessId: "",
	name: "",
	address: "",
	city: "",
	country: "",
	phone: "",
	email: "",
	isMain: false,
};

export function BusinessLocationForm({ wrapInDialog = true }: { wrapInDialog?: boolean }) {
	const {
		createBusinessLocation,
		updateBusinessLocation,
		onCloseCrudForm,
		initialCrudFormData,
		isOpenCrudForm,
	} = useBusinessLocationStore();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateBusinessLocation(initialCrudFormData.id, values);
			} else {
				// @ts-ignore
				await createBusinessLocation(values);
			}
			onCloseCrudForm();
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	const { workspace } = useWorkspace();

	useEffect(() => {
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				businessId: initialCrudFormData?.businessId || "",
				name: initialCrudFormData?.name || "",
				address: initialCrudFormData?.address || "",
				city: initialCrudFormData?.city || "",
				country: initialCrudFormData?.country || "",
				phone: initialCrudFormData?.phone || "",
				email: initialCrudFormData?.email || "",
				isMain: initialCrudFormData?.isMain || false,
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
		}
	}, [initialCrudFormData, isOpenCrudForm, form]);

	const formContent = (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									placeholder="Enter address"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="city"
					render={({ field }) => (
						<FormItem>
							<FormLabel>City</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="Enter city" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Country</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									placeholder="Enter country"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="Enter phone" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="Enter email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isMain"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="text-base">IsMain</FormLabel>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
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
			title={`${initialCrudFormData ? "Edit" : "Create"} Business Location`}
			description={`${initialCrudFormData ? "Make changes to the" : "Add a new"} Business location.`}
		>
			{formContent}
		</DialogForm>
	);
}
