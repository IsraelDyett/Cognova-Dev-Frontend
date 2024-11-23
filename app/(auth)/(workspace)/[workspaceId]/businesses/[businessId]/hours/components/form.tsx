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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useHourStore } from "../store";
import type { BusinessOperatingHours as Hour } from "@prisma/client";

const formSchema = z.object({
	businessId: z.string().min(1, "Required"),
	locationId: z.string().optional(),
	dayOfWeek: z.number(),
	openTime: z.string().min(1, "Required"),
	closeTime: z.string().min(1, "Required"),
	isClosed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
	businessId: "",
	locationId: "",
	dayOfWeek: 0,
	openTime: "",
	closeTime: "",
	isClosed: false,
};
export function HourForm() {
	const { createHour, updateHour, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } =
		useHourStore();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: FormValues) => {
		try {
			if (initialCrudFormData) {
				await updateHour(initialCrudFormData.id, values);
			} else {
				// @ts-ignore
				await createHour(values);
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
				locationId: initialCrudFormData?.locationId || "",
				dayOfWeek: initialCrudFormData?.dayOfWeek || 0,
				openTime: initialCrudFormData?.openTime || "",
				closeTime: initialCrudFormData?.closeTime || "",
				isClosed: initialCrudFormData?.isClosed || false,
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
		}
	}, [initialCrudFormData, isOpenCrudForm, form]);

	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"2xl"}>
				<DialogHeader>
					<DialogTitle>{initialCrudFormData ? "Edit" : "Create"} Hour</DialogTitle>
					<DialogDescription>
						{initialCrudFormData ? "Make changes to the" : "Add a new"} hour.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4grid-cols-1 sm:grid-cols-2"
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
							name="locationId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>LocationId</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter locationId"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="dayOfWeek"
							render={({ field }) => (
								<FormItem>
									<FormLabel>DayOfWeek</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={isLoading}
											placeholder="Enter dayOfWeek"
											{...field}
											onChange={(e) =>
												field.onChange(parseInt(e.target.value))
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="openTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>OpenTime</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter openTime"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="closeTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>CloseTime</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Enter closeTime"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isClosed"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-full">
									<FormLabel className="text-base">IsClosed</FormLabel>
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
