import { toast } from "sonner";
import { create } from "zustand";
import { debug } from "@/lib/utils";
import {
	createLocation,
	updateLocation,
	deleteLocation,
	getLocations,
} from "@/lib/actions/server/business";
import type { BusinessLocation } from "@prisma/client";

interface BusinessLocationState {
	businesslocations: BusinessLocation[];
	loading: boolean;
	error: string | null;

	// CRUD Form State
	initialCrudFormData?: BusinessLocation | null;
	isOpenCrudForm: boolean;

	fetchBusinessLocations: (businessId: string) => Promise<void>;
	createBusinessLocation: (
		data: Omit<BusinessLocation, "id" | "createdAt" | "updatedAt">,
	) => Promise<void>;
	updateBusinessLocation: (id: string, data: Partial<BusinessLocation>) => Promise<void>;
	deleteBusinessLocation: (id: string) => Promise<void>;

	// CRUD Form Actions
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: BusinessLocation) => void;
	onCloseCrudForm: () => void;
}

export const useBusinessLocationStore = create<BusinessLocationState>((set) => ({
	businesslocations: [],
	loading: true,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchBusinessLocations: async (businessId: string) => {
		debug("CLIENT", "fetchBusinessLocations", "STORE");
		set({ loading: true, error: null });
		try {
			const response = await getLocations({ businessId });
			if (response.success) {
				set({ businesslocations: response.data });
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to load BusinessLocations");
		} finally {
			set({ loading: false });
		}
	},
	createBusinessLocation: async (data) => {
		debug("CLIENT", "createBusinessLocation", "STORE");
		try {
			const response = await createLocation({ data });
			if (response.success) {
				set((state) => ({
					businesslocations: [
						...state.businesslocations,
						response?.data ?? ({} as BusinessLocation),
					],
				}));
				toast.success("BusinessLocation created successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to create BusinessLocation");
		}
	},

	updateBusinessLocation: async (id, data) => {
		debug("CLIENT", "updateBusinessLocation", "STORE");
		try {
			const response = await updateLocation({ id, data });
			if (response.success) {
				set((state) => ({
					businesslocations: state.businesslocations.map((item) =>
						item.id === id ? (response.data ?? ({} as BusinessLocation)) : item,
					),
				}));
				toast.success("BusinessLocation updated successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to update BusinessLocation");
		}
	},

	deleteBusinessLocation: async (id) => {
		debug("CLIENT", "deleteBusinessLocation", "STORE");
		set({ loading: true, error: null });
		try {
			const response = await deleteLocation({ id });
			if (response.success) {
				set((state) => ({
					businesslocations: state.businesslocations.filter((item) => item.id !== id),
				}));
				toast.success("BusinessLocation deleted successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to delete BusinessLocation");
		} finally {
			set({ loading: false });
		}
	},
	onOpenCreateForm: () => {
		set({
			isOpenCrudForm: true,
			initialCrudFormData: null,
		});
	},

	onOpenEditForm: (data) => {
		set({
			isOpenCrudForm: true,
			initialCrudFormData: data,
		});
	},

	onCloseCrudForm: () => {
		set({
			isOpenCrudForm: false,
			initialCrudFormData: null,
		});
	},
}));
