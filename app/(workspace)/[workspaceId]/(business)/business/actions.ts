"use server";

import { prisma } from "@/lib/services/prisma";
import { Business, BusinessProduct } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createBusiness(data: Business) {
  try {
    const { id, ...rest } = data;
    const business = await prisma.business.create({ data: rest });
    revalidatePath("/[workspaceId]/business");
    return { success: true, data: business };
  } catch (error) {
    return { success: false, error: "Failed to create business" };
  }
}

export async function updateBusiness(id: string, data: Partial<Business>) {
  try {
    const business = await prisma.business.update({
      where: { id },
      data,
    });
    revalidatePath("/[workspaceId]/business");
    return { success: true, data: business };
  } catch (error) {
    return { success: false, error: "Failed to update business" };
  }
}

export async function deleteBusiness(id: string) {
  try {
    await prisma.business.delete({
      where: { id },
    });
    revalidatePath("/[workspaceId]/business");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete business" };
  }
}

export async function getBusiness(id: string) {
  try {
    const business = await prisma.business.findUnique({
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
    return { success: true, data: business };
  } catch (error) {
    return { success: false, error: "Failed to fetch business" };
  }
}

export async function getBusinesses(workspaceId: string) {
  try {
    const businesses = await prisma.business.findMany({
      where: { workspaceId },
      include: {
        configurations: true,
      },
    });
    return { success: true, data: businesses };
  } catch (error) {
    return { success: false, error: "Failed to fetch businesses" };
  }
}

export async function createProduct(
  businessId: string,
  data: Omit<BusinessProduct, "id" | "businessId">,
) {
  try {
    const product = await prisma.businessProduct.create({
      data: {
        ...data,
        businessId,
      },
    });
    revalidatePath(`/[workspaceId]/business/${businessId}`);
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.businessProduct.update({
      where: { id },
      data,
    });
    revalidatePath(`/[workspaceId]/business/${product.businessId}`);
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.businessProduct.delete({
      where: { id },
    });
    revalidatePath(`/[workspaceId]/business/${product.businessId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}
