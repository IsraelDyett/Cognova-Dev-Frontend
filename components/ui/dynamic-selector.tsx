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
import React from 'react'
import { UseFormReturn } from "react-hook-form";

export default function DynamicSelector({
    form,
    idKey,
    items,
    itemKey = "id",
    itemLabelKey,
    label,
    description,
    ...props
}: {
    form: UseFormReturn | any,
    idKey: string,
    items: any[],
    itemKey?: string,
    itemLabelKey: string,
    label: string,
    description?: string,
}) {
    return (
        <FormField
            control={form.control}
            name={idKey}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item, idx) => (
                                <SelectItem key={item?.[itemKey] ?? idx} value={item?.[itemKey]}>
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
    )
}
