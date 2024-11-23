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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessConfig } from "@prisma/client";

const businessConfigSchema = z.object({
	deliveryFee: z.number().min(0).optional(),
	estimatedDeliveryArrival: z.string().optional(),
	minOrderAmount: z.number().min(0).optional(),
	taxRate: z.number().min(0).max(100).optional(),
	returnPeriodDays: z.number().int().min(0).optional(),
	warrantyPeriodDays: z.number().int().min(0).optional(),
	currency: z.string().default("USD"),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

export function BusinessConfigForm({ businessConfig }: { businessConfig?: BusinessConfig }) {
	const form = useForm<BusinessConfigFormValues>({
		resolver: zodResolver(businessConfigSchema),
		defaultValues: {
			deliveryFee: businessConfig?.deliveryFee || 0,
			estimatedDeliveryArrival: businessConfig?.estimatedDeliveryArrival || "",
			minOrderAmount: businessConfig?.minOrderAmount || 0,
			taxRate: businessConfig?.taxRate || 0,
			returnPeriodDays: businessConfig?.returnPeriodDays || 0,
			warrantyPeriodDays: businessConfig?.warrantyPeriodDays || 0,
			currency: businessConfig?.currency || "",
		},
	});

	function onSubmit(data: BusinessConfigFormValues) {
		console.log(data);
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
											step="0.01"
											className="pl-8"
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
										<Input className="pl-8" {...field} />
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
						name="minOrderAmount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum Order Amount</FormLabel>
								<FormControl>
									<div className="relative">
										<CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											step="0.01"
											className="pl-8"
											{...field}
											value={field.value || ""}
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
						name="taxRate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tax Rate (%)</FormLabel>
								<FormControl>
									<div className="relative">
										<Percent className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											step="0.01"
											className="pl-8"
											{...field}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>The tax rate as a percentage.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="returnPeriodDays"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Return Period (Days)</FormLabel>
								<FormControl>
									<div className="relative">
										<Box className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											className="pl-8"
											{...field}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>
									The number of days allowed for returns.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="warrantyPeriodDays"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Warranty Period (Days)</FormLabel>
								<FormControl>
									<div className="relative">
										<Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											className="pl-8"
											{...field}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>
									The number of days the warranty is valid for.
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
										<SelectItem value="EUR">EUR</SelectItem>
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
				</div>
				<Button type="submit">Save Changes</Button>
			</form>
		</Form>
	);
}
