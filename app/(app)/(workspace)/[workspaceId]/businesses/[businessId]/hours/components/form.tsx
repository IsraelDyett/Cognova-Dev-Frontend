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
import { WeekDays, type BusinessOperatingHours as Hour } from "@prisma/client";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";
import DynamicSelector from "@/components/ui/dynamic-selector";
import { useBusinessLocationStore } from "../../locations/store";
import { useParams } from "next/navigation";

const formSchema = z.object({
	businessId: z.string().cuid(),
	locationId: z.string().optional(),
	dayOfWeek: z.string(),
	openTime: z.string().min(1, "Required"),
	closeTime: z.string().min(1, "Required"),
	isClosed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
	businessId: "",
	locationId: "",
	dayOfWeek: WeekDays.MONDAY as WeekDays,
	openTime: "",
	closeTime: "",
	isClosed: false,
};
export function HourForm() {
	const { createHour, updateHour, onCloseCrudForm, initialCrudFormData, isOpenCrudForm } =
		useHourStore();

	const { fetchBusinessLocations, businesslocations } = useBusinessLocationStore();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: any) => {
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
	const { workspace } = useWorkspace();
	const { businessId } = useParams();
	useEffect(() => {
		if (businesslocations.length == 0) {
			fetchBusinessLocations(`${businessId}`);
		}
		if (isOpenCrudForm && initialCrudFormData) {
			form.reset({
				businessId: initialCrudFormData?.businessId || "",
				locationId: initialCrudFormData?.locationId || "",
				dayOfWeek: initialCrudFormData?.dayOfWeek || WeekDays.MONDAY,
				openTime: initialCrudFormData?.openTime || "",
				closeTime: initialCrudFormData?.closeTime || "",
				isClosed: initialCrudFormData?.isClosed || false,
			});
		} else if (isOpenCrudForm) {
			form.reset(defaultValues);
		}
	}, [
		initialCrudFormData,
		isOpenCrudForm,
		form,
		businesslocations.length,
		fetchBusinessLocations,
		businessId,
	]);

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
						className="grid gap-4 grid-cols-1 sm:grid-cols-2"
					>
						<DynamicSelector
							label="Business"
							form={form}
							items={workspace?.businesses || []}
							itemKey="id"
							itemLabelKey="name"
							idKey="businessId"
						/>

						<DynamicSelector
							label="Location"
							form={form}
							items={businesslocations || []}
							itemKey="id"
							itemLabelKey="name"
							idKey="locationId"
						/>
						<DynamicSelector
							label="Day Of Week"
							form={form}
							items={[
								{ id: WeekDays.SUNDAY, name: "Sunday" },
								{ id: WeekDays.MONDAY, name: "Monday" },
								{ id: WeekDays.TUESDAY, name: "Tuesday" },
								{ id: WeekDays.WEDNESDAY, name: "Wednesday" },
								{ id: WeekDays.THURSDAY, name: "Thursday" },
								{ id: WeekDays.FRIDAY, name: "Friday" },
								{ id: WeekDays.SATURDAY, name: "Saturday" },
							]}
							itemKey="id"
							itemLabelKey="name"
							idKey="dayOfWeek"
						/>

						<FormField
							control={form.control}
							name="openTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Open Time</FormLabel>
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
									<FormLabel>Close Time</FormLabel>
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
								<FormItem className="flex flex-col">
									<FormLabel className="text-base">Is Closed</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
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
