"use client";
/* eslint-disable */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeClosedIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	invalid?: boolean;
	showPasswordToggle?: boolean;
	suffixAction?: () => void;
	suffixProcessing?: boolean;
	SuffixIcon?: React.ElementType;
}

function IconSpinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("size-4 animate-spin text-white", className)}
			{...props}
		>
			<circle
				strokeWidth={4}
				stroke="currentColor"
				r="10"
				cy="12"
				cx="12"
				className="opacity-25"
			/>
			<path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" className="opacity-75" />
		</svg>
	);
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			showPasswordToggle = false,
			suffixAction,
			suffixProcessing,
			SuffixIcon,
			...props
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword(!showPassword);
		};

		if (SuffixIcon && suffixAction === undefined) {
			throw new Error(
				"If SuffixIcon is provided, both suffixAction and suffixProcessing must be defined.",
			);
		}

		const inputElement = (
			<input
				ref={ref}
				type={type === "password" && showPassword ? "text" : type}
				className={cn(
					`block w-full ${SuffixIcon && "!pr-10"} flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`,
					props["aria-invalid"] && "ring-1 ring-red-500 focus-visible:ring-red-500",
					className,
				)}
				{...props}
			/>
		);

		const SuffixElement = ({
			children,
			action,
		}: {
			children: React.ReactNode;
			action?: () => void;
		}) => (
			<button
				type="button"
				className={cn(
					"absolute inset-y-0 flex items-center justify-center right-0 ml-3 mr-1 my-1 px-2 rounded-md hover:bg-secondary",
				)}
				onClick={action ? action : () => {}}
			>
				{children}
			</button>
		);

		const Icon = ({ Icon }: { Icon: React.ElementType }) => (
			<Icon className="h-5 w-5 text-gray-400" />
		);
		if (type === "password" && showPasswordToggle) {
			return (
				<div className="relative">
					{inputElement}
					<SuffixElement action={togglePasswordVisibility}>
						{showPassword ? <Icon Icon={EyeClosedIcon} /> : <Icon Icon={Eye} />}
					</SuffixElement>
				</div>
			);
		}

		if (SuffixIcon) {
			return (
				<div className="relative">
					{inputElement}
					<SuffixElement action={suffixAction}>
						{suffixProcessing ? (
							<Icon Icon={IconSpinner} />
						) : (
							<Icon Icon={SuffixIcon} />
						)}
					</SuffixElement>
				</div>
			);
		}

		return inputElement;
	},
);
Input.displayName = "Input";

export { Input };
