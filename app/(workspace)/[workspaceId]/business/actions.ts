"use server";
import { prisma } from "@/lib/services/prisma";
import type { Business } from "@prisma/client";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createBusiness(
  data: Omit<Business, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<Business>> {
  try {
    const result = await prisma.business.create({
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err;
    return { success: false, error: error.message };
  }
}

export async function updateBusiness(
  id: string,
  data: Partial<Business>,
): Promise<ApiResponse<Business>> {
  try {
    const result = await prisma.business.update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err;
    return { success: false, error: error.message };
  }
}

export async function deleteBusiness(id: string): Promise<ApiResponse<Business>> {
  try {
    const result = await prisma.business.delete({
      where: { id },
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err;
    return { success: false, error: error.message };
  }
}

export async function retrieveBusiness(id: string): Promise<ApiResponse<Business>> {
  try {
    const result = await prisma.business.findUnique({
      where: { id },
      include: {
        configurations: true,
        categories: true,
        products: true,
        locations: true,
        operatingHours: {
          include: {
            location: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        bots: true,
      },
    });
    if (!result) {
      return { success: false, error: "Business not found" };
    }
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err;
    return { success: false, error: error.message };
  }
}

export async function listBusinesss(
  whereInput: { where?: any } = {},
): Promise<ApiResponse<Business[]>> {
  try {
    const results = await prisma.business.findMany(whereInput);
    return { success: true, data: results };
  } catch (err: any) {
    const error: Error = err;
    return { success: false, error: error.message };
  }
}
