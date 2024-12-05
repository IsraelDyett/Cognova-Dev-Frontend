import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export default function DynamicSelector({
	form,
	idKey,
	items,
	itemKey = "id",
	itemLabelKey,
	label,
	description,
	labelProps,
	...props
}: {
	form: UseFormReturn | any;
	idKey: string;
	items: any[];
	itemKey?: string | number;
	itemLabelKey: string;
	label: string;
	description?: string;
	labelProps?: React.ComponentProps<typeof FormLabel>;
}) {
	return (
		<FormField
			control={form.control}
			name={idKey}
			render={({ field }) => (
				<FormItem>
					<FormLabel {...labelProps}>{label}</FormLabel>
					<Select
						onValueChange={(value) =>
							field.onChange(isNaN(parseInt(value)) ? value : parseInt(value))
						}
						defaultValue={field.value}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items.map((item, idx) => (
								<SelectItem
									key={item?.[itemKey] ?? idx}
									value={
										isNaN(parseInt(item?.[itemKey]))
											? item?.[itemKey]
											: parseInt(item?.[itemKey])
									}
								>
									{item?.[itemLabelKey]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
			{...props}
		/>
	);
}
