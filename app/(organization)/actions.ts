"use server";
import { prisma } from "@/lib/services/prisma";

const getOrganizations = async (userId: string) => {
    const organizations = await prisma.organizationUser.findMany({
        where: {
            userId: userId,
        },
        select: {
            organization: true,
        }
    });
    return organizations;
}