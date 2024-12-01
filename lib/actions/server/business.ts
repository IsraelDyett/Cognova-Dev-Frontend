"use server";
import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class BusinessServerActions extends BaseServerActionActions {
	public static async getBusinesses({
		workspaceId,
		include = {},
	}: {
		workspaceId: string;
		include?: Prisma.BusinessInclude;
	}) {
		return this.executeAction(
			() =>
				this.prisma.business.findMany({
					where: {
						workspaceId,
					},
					include,
				}),
			"Failed to get businesses",
		);
	}

	public static async createBusiness({ data }: { data: Prisma.BusinessUncheckedCreateInput }) {
		return this.executeAction(
			() => this.prisma.business.create({ data }),
			"Failed to create business",
		);
	}

	public static async updateBusiness({
		id,
		data,
	}: {
		id: string;
		data: Prisma.BusinessUncheckedUpdateInput;
	}) {
		return this.executeAction(
			() =>
				this.prisma.business.update({
					where: { id },
					data,
				}),
			"Failed to update business",
		);
	}

	public static async deleteBusiness({ id }: { id: string }) {
		return this.executeAction(
			() =>
				this.prisma.business.delete({
					where: { id },
				}),
			"Failed to delete business",
		);
	}

	// Location methods
	public static async getLocations({
		businessId,
		include = {},
	}: {
		businessId: string;
		include?: Prisma.BusinessLocationInclude;
	}) {
		return this.executeAction(
			() =>
				this.prisma.businessLocation.findMany({
					where: { businessId },
					include,
				}),
			"Failed to get business locations",
		);
	}

	public static async createLocation({
		data,
	}: {
		data: Prisma.BusinessLocationUncheckedCreateInput;
	}) {
		return this.executeAction(
			() => this.prisma.businessLocation.create({ data }),
			"Failed to create business location",
		);
	}

	public static async updateLocation({
		id,
		data,
	}: {
		id: string;
		data: Prisma.BusinessLocationUncheckedUpdateInput;
	}) {
		return this.executeAction(
			() =>
				this.prisma.businessLocation.update({
					where: { id },
					data,
				}),
			"Failed to update business location",
		);
	}

	public static async deleteLocation({ id }: { id: string }) {
		return this.executeAction(
			() =>
				this.prisma.businessLocation.delete({
					where: { id },
				}),
			"Failed to delete business location",
		);
	}

	// Product methods
	public static async getProducts({
		businessId,
		include = {},
	}: {
		businessId: string;
		include?: Prisma.BusinessProductInclude;
	}) {
		return this.executeAction(
			() =>
				this.prisma.businessProduct.findMany({
					where: { businessId },
					include,
				}),
			"Failed to get business products",
		);
	}

	public static async createProduct({
		data,
	}: {
		data: Prisma.BusinessProductUncheckedCreateInput;
	}) {
		return this.executeAction(
			() => this.prisma.businessProduct.create({ data }),
			"Failed to create business product",
		);
	}

	public static async updateProduct({
		id,
		data,
	}: {
		id: string;
		data: Prisma.BusinessProductUncheckedUpdateInput;
	}) {
		return this.executeAction(
			() =>
				this.prisma.businessProduct.update({
					where: { id },
					data,
				}),
			"Failed to update business product",
		);
	}

	public static async deleteProduct({ id }: { id: string }) {
		return this.executeAction(
			() =>
				this.prisma.businessProduct.delete({
					where: { id },
				}),
			"Failed to delete business product",
		);
	}

	public static async retrieveBusinessConfig({ businessId }: { businessId: string }) {
		return this.executeAction(
			() => this.prisma.businessConfig.findUnique({ where: { businessId } }),
			"Failed to retrieve business config",
		);
	}
}

export async function getBusinesses(...args: Parameters<typeof BusinessServerActions.getBusinesses>) {
	return BusinessServerActions.getBusinesses(...args)
}
export async function createBusiness(...args: Parameters<typeof BusinessServerActions.createBusiness>) {
	return BusinessServerActions.createBusiness(...args)
}
export async function updateBusiness(...args: Parameters<typeof BusinessServerActions.updateBusiness>) {
	return BusinessServerActions.updateBusiness(...args)
}
export async function deleteBusiness(...args: Parameters<typeof BusinessServerActions.deleteBusiness>) {
	return BusinessServerActions.deleteBusiness(...args)
}
export async function getLocations(...args: Parameters<typeof BusinessServerActions.getLocations>) {
	return BusinessServerActions.getLocations(...args)
}
export async function createLocation(...args: Parameters<typeof BusinessServerActions.createLocation>) {
	return BusinessServerActions.createLocation(...args)
}
export async function updateLocation(...args: Parameters<typeof BusinessServerActions.updateLocation>) {
	return BusinessServerActions.updateLocation(...args)
}
export async function deleteLocation(...args: Parameters<typeof BusinessServerActions.deleteLocation>) {
	return BusinessServerActions.deleteLocation(...args)
}
export async function getProducts(...args: Parameters<typeof BusinessServerActions.getProducts>) {
	return BusinessServerActions.getProducts(...args)
}
export async function createProduct(...args: Parameters<typeof BusinessServerActions.createProduct>) {
	return BusinessServerActions.createProduct(...args)
}
export async function updateProduct(...args: Parameters<typeof BusinessServerActions.updateProduct>) {
	return BusinessServerActions.updateProduct(...args)
}
export async function deleteProduct(...args: Parameters<typeof BusinessServerActions.deleteProduct>) {
	return BusinessServerActions.deleteProduct(...args)
}
export async function retrieveBusinessConfig(...args: Parameters<typeof BusinessServerActions.retrieveBusinessConfig>) {
	return BusinessServerActions.retrieveBusinessConfig(...args)
}
export default BusinessServerActions;
