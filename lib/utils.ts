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
export async function delay(ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}