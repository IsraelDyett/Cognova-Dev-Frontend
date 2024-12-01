import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function cloneElement(element: React.ReactElement, classNames: string) {
	return React.cloneElement(element, {
		className: twMerge(element.props.className, classNames),
	});
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
export const isEmailValid = (email: string) => {
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

export function removeEmptyKeys<T extends object>(obj: T): T {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (
			value === "" ||
			value === null ||
			value === undefined ||
			(Array.isArray(value) && value.length === 0)
		) {
			return acc;
		}
		return { ...acc, [key]: value };
	}, {} as T);
}
`utm_source: Identifies which site sent the traffic
Example: utm_source=facebook
utm_medium: Indicates the marketing medium
Example: utm_medium=cpc (for paid search), utm_medium=email, utm_medium=social
utm_campaign: Specifies your campaign name
Example: utm_campaign=spring_sale
utm_term: Tracks paid search keywords
Example: utm_term=marketing+tools
utm_content: Differentiates similar content or links
Example: utm_content=headerlink or utm_content=sidebar
`;
// https://yourSaaS.com/landing-page?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=tweet1
