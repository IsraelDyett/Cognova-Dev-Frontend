
"use server";
import { debug } from "@/lib/utils";
import { prisma } from "@/lib/services/prisma";
import type { BusinessLocation } from '@prisma/client';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createBusinessLocation(
  data: Omit<BusinessLocation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<BusinessLocation>> {
  debug("SERVER", "createBusinessLocation", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessLocation.create({
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function updateBusinessLocation(
  id: string,
  data: Partial<BusinessLocation>
): Promise<ApiResponse<BusinessLocation>> {
  debug("SERVER", "updateBusinessLocation", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessLocation.update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function deleteBusinessLocation(
  id: string
): Promise<ApiResponse<BusinessLocation>> {
  debug("SERVER", "deleteBusinessLocation", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessLocation.delete({
      where: { id },
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function retrieveBusinessLocation(
  id: string
): Promise<ApiResponse<BusinessLocation>> {
  debug("SERVER", "retrieveBusinessLocation", "PRISMA ACTIONS")
  try {
    const result = await prisma.businessLocation.findUnique({
      where: { id },
    });
    if (!result) {
      return { success: false, error: 'BusinessLocation not found' };
    }
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function getBusinessLocations(
  whereInput: { where?: any } = {}
): Promise<ApiResponse<BusinessLocation[]>> {
  debug("SERVER", "listBusinessLocations", "PRISMA ACTIONS")
  try {
    const results = await prisma.businessLocation.findMany(whereInput);
    return { success: true, data: results };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}
