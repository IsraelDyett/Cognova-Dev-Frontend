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
import { useBusinessStore } from "../store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "../../../contexts/workspace-context";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
	workspaceId: z.string().min(1, "Required"),
	name: z.string().min(1, "Required"),
	type: z.string().min(1, "Required"),
	description: z.string().optional(),
	hasDelivery: z.boolean(),
	acceptsReturns: z.boolean(),
	hasWarranty: z.boolean(),
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
				hasDelivery: initialCrudFormData?.hasDelivery || false,
				acceptsReturns: initialCrudFormData?.acceptsReturns || false,
				hasWarranty: initialCrudFormData?.hasWarranty || false,
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
								<FormItem>
									<FormLabel>Type</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter type"
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
								<FormItem className=" col-span-full">
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

						<div className="grid-cols-2 grid col-span-full">
							<FormField
								control={form.control}
								name="hasDelivery"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel className="text-base">We do Delivery</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="acceptsReturns"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel className="text-base">Accept Returns</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasWarranty"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel className="text-base">
											Provide Warranty
										</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
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
