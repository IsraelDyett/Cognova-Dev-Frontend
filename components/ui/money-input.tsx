"use client";
import { useEffect, useReducer } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { useBusinessStore } from "@/app/(app)/(workspace)/[workspaceId]/businesses/store";
import { create } from "zustand";
import { retrieveBusiness } from "@/lib/actions/server/business";
import { useParams } from "next/navigation";

type TextInputProps = {
	form: UseFormReturn<any>;
	name: string;
	label: string;
	placeholder?: string;
};

interface InputStoreState {
	currency: string | null;
	setCurrency: (currency: string) => void;
}

const useInputStore = create<InputStoreState>((set) => ({
	currency: null,
	setCurrency: (currency: string) => set({ currency }),
}));

export default function MoneyInput(props: TextInputProps) {
	const params = useParams();
	const { currency, setCurrency } = useInputStore();

	const moneyFormatter = Intl.NumberFormat(undefined, {
		currency: currency || "USD",
		currencyDisplay: "symbol",
		currencySign: "standard",
		style: "currency",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	const initialValue = props.form.getValues()[props.name]
		? moneyFormatter.format(props.form.getValues()[props.name])
		: "";

	const [value, setValue] = useReducer((_: any, next: string) => {
		const digits = next.replace(/\D/g, "");
		return moneyFormatter.format(Number(digits) / 100);
	}, initialValue);

	// eslint-disable-next-line @typescript-eslint/ban-types
	function handleChange(realChangeFn: Function, formattedValue: string) {
		const digits = formattedValue.replace(/\D/g, "");
		const realValue = Number(digits) / 100;
		realChangeFn(realValue);
	}
	useEffect(() => {
		if (params.businessId && !currency) {
			retrieveBusiness({
				businessId: params.businessId as string,
				include: { configurations: true },
			}).then((res) => {
				setCurrency(res.data?.configurations?.currency || "USD");
				setValue(value);
			});
		}
	}, [currency, params.businessId, setCurrency, value]);

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				field.value = value;
				const _change = field.onChange;

				return (
					<FormItem>
						<FormLabel>{props.label}</FormLabel>
						<FormControl>
							<Input
								placeholder={props.placeholder || ""}
								type="text"
								{...field}
								onChange={(ev) => {
									setValue(ev.target.value);
									handleChange(_change, ev.target.value);
								}}
								value={value}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
