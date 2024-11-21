"use server";
import { prisma } from "@/lib/services/prisma";

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        features: true,
      },
    });
    return plans;
  } catch (error) {
    console.log("GETTING PLANS ERROR: ", error);
    return [];
  }
}
export async function getRoles() {
  try {
    return prisma.role.findMany();
  } catch (error) {
    console.error("GETTING ROLES ERROR: ", error);
    return [];
  }
}
