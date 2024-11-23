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
import { useBusinessLocationStore } from "../store";
import type { BusinessLocation } from "@prisma/client";

const formSchema = z.object({
	businessId: z.string().min(1, "Required"),
	name: z.string().min(1, "Required"),
	address: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	state: z.string().optional(),
	country: z.string().min(1, "Required"),
	postalCode: z.string().optional(),
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
	state: "",
	country: "",
	postalCode: "",
	phone: "",
	email: "",
	isMain: false,
};
export function BusinessLocationForm() {
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
	useEffect(() => {
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				businessId: initialCrudFormData?.businessId || "",
				name: initialCrudFormData?.name || "",
				address: initialCrudFormData?.address || "",
				city: initialCrudFormData?.city || "",
				state: initialCrudFormData?.state || "",
				country: initialCrudFormData?.country || "",
				postalCode: initialCrudFormData?.postalCode || "",
				phone: initialCrudFormData?.phone || "",
				email: initialCrudFormData?.email || "",
				isMain: initialCrudFormData?.isMain || false,
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
		}
	}, [initialCrudFormData, isOpenCrudForm, form]);

	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"3xl"}>
				<DialogHeader>
					<DialogTitle>
						{initialCrudFormData ? "Edit" : "Create"} BusinessLocation
					</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"}{" "}
						businesslocation.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4grid-cols-1 sm:grid-cols-3 md:grid-cols-4"
					>
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
										<Input
											disabled={isLoading}
											placeholder="Enter city"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="state"
							render={({ field }) => (
								<FormItem>
									<FormLabel>State</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter state"
											{...field}
										/>
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
							name="postalCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>PostalCode</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter postalCode"
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
										<Input
											disabled={isLoading}
											placeholder="Enter phone"
											{...field}
										/>
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
										<Input
											disabled={isLoading}
											placeholder="Enter email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isMain"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-full">
									<FormLabel className="text-base">IsMain</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
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
