"use server";
import { prisma } from "@/lib/services/prisma";
import { removeEmptyKeys } from "@/lib/utils";
import type { BusinessConfig, BusinessProduct as Product } from "@prisma/client";

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export async function createProduct(
	data: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<(Product & { business: { configurations: BusinessConfig | null } })>> {
	try {
		const cleanData = removeEmptyKeys(data);
		const result = await prisma.businessProduct.create({
			data: cleanData,
			include: {
				business: {
					select: {
						configurations: true,
					}
				}
			}
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function updateProduct(
	id: string,
	data: Partial<Product>,
): Promise<ApiResponse<(Product & { business: { configurations: BusinessConfig | null } })>> {
	try {
		const cleanData = removeEmptyKeys(data);
		const result = await prisma.businessProduct.update({
			where: { id },
			data: cleanData,
			include: {
				business: {
					select: {
						configurations: true,
					}
				}
			}
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function deleteProduct(id: string): Promise<ApiResponse<Product>> {
	try {
		const result = await prisma.businessProduct.delete({
			where: { id },
		});
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function retrieveProduct(id: string): Promise<ApiResponse<Product>> {
	try {
		const result = await prisma.businessProduct.findUnique({
			where: { id },
		});
		if (!result) {
			return { success: false, error: "Product not found" };
		}
		return { success: true, data: result };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

export async function getProducts(
	whereInput: { where?: any } = {},
): Promise<ApiResponse<(Product & { business: { configurations: BusinessConfig | null } })[]>> {
	try {
		const results = await prisma.businessProduct.findMany({
			...whereInput,
			include: {
				business: {
					select: {
						configurations: true,
					}
				}
			}
		});
		return { success: true, data: results };
	} catch (err: any) {
		const error: Error = err;
		return { success: false, error: error.message };
	}
}

