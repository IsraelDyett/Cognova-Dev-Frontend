"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Banknote, Box, Calendar, CreditCard, Percent, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BusinessConfig } from "@prisma/client";
import { updateOrCreateBusinessConfig } from "@/lib/actions/server/business";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const businessConfigSchema = z.object({
	deliveryFee: z.number().min(0).optional(),
	estimatedDeliveryArrival: z.string().optional(),
	minDeliveryOrderAmount: z.number().min(0).optional(),
	returnPeriod: z.string().optional(),
	warrantyPeriod: z.string().optional(),
	currency: z.string().default("USD"),
	hasDelivery: z.boolean().default(false),
acceptsReturns: z.boolean().default(false),
hasWarranty: z.boolean().default(false),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

export function BusinessConfigForm({ businessConfig }: { businessConfig: BusinessConfig | null }) {
	const { businessId } = useParams()
	const form = useForm<BusinessConfigFormValues>({
		resolver: zodResolver(businessConfigSchema),
		defaultValues: {
			deliveryFee: businessConfig?.deliveryFee || 0,
			estimatedDeliveryArrival: businessConfig?.estimatedDeliveryArrival || "",
			minDeliveryOrderAmount: businessConfig?.minDeliveryOrderAmount || 0,
			returnPeriod: businessConfig?.returnPeriod || "",
			warrantyPeriod: businessConfig?.warrantyPeriod || "",
			currency: businessConfig?.currency || "",
			hasDelivery: businessConfig?.hasDelivery,
			acceptsReturns: businessConfig?.acceptsReturns,
			hasWarranty: businessConfig?.hasWarranty
		},
	});

	async function onSubmit(data: BusinessConfigFormValues) {
		const data_ = { ...data, businessId: `${businessId}` }
		const response = await updateOrCreateBusinessConfig({ businessId: `${businessId}`, data: data_ });
		if (response.success) {
			toast.success("BusinessConfig created/updated successfully");
		} else {
			toast.error(response.error)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="deliveryFee"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Delivery Fee</FormLabel>
								<FormControl>
									<div className="relative">
										<Truck className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											className="pl-8"
											placeholder="$2"
											{...field}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>The fee charged for delivery.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="estimatedDeliveryArrival"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estimated Delivery Arrival</FormLabel>
								<FormControl>
									<div className="relative">
										<Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input className="pl-8" {...field} placeholder="2 Hours" />
									</div>
								</FormControl>
								<FormDescription>
									Estimated time for delivery arrival.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="minDeliveryOrderAmount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum Delivery Order Amount</FormLabel>
								<FormControl>
									<div className="relative">
										<CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											className="pl-8"
											placeholder="10"
											{...field}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>
									The minimum amount required for an order.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="returnPeriod"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Return Period</FormLabel>
								<FormControl>
									<div className="relative">
										<Box className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="text"
											className="pl-8"
											placeholder="2 Days"
											{...field}
										/>
									</div>
								</FormControl>
								<FormDescription>The period allowed for returns.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="warrantyPeriod"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Warranty Period</FormLabel>
								<FormControl>
									<div className="relative">
										<Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-8"
											placeholder="12 Months"
											{...field}
										/>
									</div>
								</FormControl>
								<FormDescription>
									The period the warranty is valid for.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="currency"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Currency</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<div className="relative">
											<Banknote className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<SelectTrigger className="pl-8">
												<SelectValue placeholder="Select a currency" />
											</SelectTrigger>
										</div>
									</FormControl>
									<SelectContent>
										<SelectItem value="USD">USD</SelectItem>
										<SelectItem value="RWF">RWF</SelectItem>
										<SelectItem value="GBP">GBP</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									The currency used for transactions.
								</FormDescription>
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
				</div>
				<Button type="submit">Save Changes</Button>
			</form>
		</Form>
	);
}
