import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  return await new Promise(resolve => setTimeout(resolve, ms));
}
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const getCurrentWorkspace = () => {
  if (typeof window !== "undefined") {
    const workspace = window.location.href.split('/')[3];
    return workspace;
  }
  return "";
}
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
  return "/"
}