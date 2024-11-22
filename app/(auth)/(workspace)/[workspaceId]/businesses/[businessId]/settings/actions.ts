
"use server";
import { debug } from "@/lib/utils";
import { prisma } from "@/lib/services/prisma";
import type { BusinessConfig } from '@prisma/client';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createBusinessConfig(
  data: Omit<BusinessConfig, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<BusinessConfig>> {
  debug("SERVER", "createBusinessConfig", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessConfig.create({
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function updateBusinessConfig(
  id: string,
  data: Partial<BusinessConfig>
): Promise<ApiResponse<BusinessConfig>> {
  debug("SERVER", "updateBusinessConfig", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessConfig.update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function retrieveBusinessConfig(
  businessId: string
): Promise<ApiResponse<BusinessConfig>> {
  debug("SERVER", "retrieveBusinessConfig", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessConfig.findFirst({
      where: { businessId: businessId },
    });
    if (!result) {
      return { success: false, error: 'BusinessConfig not found' };
    }
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}
