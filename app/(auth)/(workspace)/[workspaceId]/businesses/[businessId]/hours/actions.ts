"use server";
import { debug } from "@/lib/utils";
import { prisma } from "@/lib/services/prisma";
import type { BusinessOperatingHours as Hour } from "@prisma/client";

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export async function createHour(
	data: Omit<Hour, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<Hour>> {
	debug("SERVER", "createHour", "PRISMA ACTIONS");
	try {
		const result = await prisma.businessOperatingHours.create({
			data,
			include: {
				location: true,
			}
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function updateHour(id: string, data: Partial<Hour>): Promise<ApiResponse<Hour>> {
	debug("SERVER", "updateHour", "PRISMA ACTIONS");
	try {
		const result = await prisma.businessOperatingHours.update({
			where: { id },
			data,
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function deleteHour(id: string): Promise<ApiResponse<Hour>> {
	debug("SERVER", "deleteHour", "PRISMA ACTIONS");
	try {
		const result = await prisma.businessOperatingHours.delete({
			where: { id },
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function retrieveHour(id: string): Promise<ApiResponse<Hour>> {
	debug("SERVER", "retrieveHour", "PRISMA ACTIONS");
	try {
		const result = await prisma.businessOperatingHours.findUnique({
			where: { id },
		});
		if (!result) {
			return { success: false, error: "Hour not found" };
		}
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function getHours(whereInput: { where?: any } = {}): Promise<ApiResponse<Hour[]>> {
	debug("SERVER", "getHours", "PRISMA ACTIONS");
	try {
		const results = await prisma.businessOperatingHours.findMany({
			...whereInput,
			include: {
				location: true,
			},
		});
		return { success: true, data: results };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}
