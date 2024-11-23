import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function exclude(data: any, ...keys: string[]): typeof data {
	for (const key of keys) {
		delete data[key];
	}

	return data;
}
export function includeOnly(data: any, keys: string[]): typeof data {
	const result = {} as typeof data;
	for (const key of keys) {
		result[key] = data[key];
	}
}
export async function delay(ms: number) {
	return await new Promise((resolve) => setTimeout(resolve, ms));
}
export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
};
export const getCurrentWorkspace = () => {
	if (typeof window !== "undefined") {
		const workspace = window.location.href.split("/")[3];
		return workspace;
	}
	return "";
};
export const getBaseUUIDPath = () => {
	const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
	if (typeof window !== "undefined") {
		const url = window.location.href;
		const uuidMatch = url.match(uuidRegex);
		if (uuidMatch) {
			return url.split(uuidMatch?.[0] || "/")?.[0] + (uuidMatch?.[0] || "");
		} else {
			return url;
		}
	}
	return "/";
};

export const toKebabCase = (text: string) =>
	text.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const toCamelCase = <T extends string>(text: T) =>
	text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
		p2 ? p2.toUpperCase() : p1.toLowerCase(),
	);

export const toPascalCase = <T extends string>(text: T): string => {
	const camelCase = toCamelCase(text);

	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
interface DebugOptions {
	where: "SERVER" | "CLIENT" | "API";
	functionName: string;
	env: "STORE" | "PRISMA ACTIONS" | "CONTEXT" | "PAGE" | "UTILS-FUNC";
}
export const debug = (
	where: DebugOptions["where"] = "CLIENT",
	functionName: DebugOptions["functionName"],
	env: DebugOptions["env"],
	...args: any
) => {
	// if (process.env.NODE_ENV === "development") {
	console.info(
		`[🌍] DEBUG: [${where}] ${toKebabCase(`${functionName}`).replaceAll("-", " ").toUpperCase()} {${env}}: ${format(new Date(), "HH:mm:s")}`,
	);
	// }
};
