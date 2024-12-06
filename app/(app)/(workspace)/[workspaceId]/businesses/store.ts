import { create } from "zustand";
import { toast } from "sonner";
import type { Business } from "@prisma/client";
import {
	createBusiness,
	deleteBusiness,
	getBusinesses,
	updateBusiness,
} from "@/lib/actions/server/business";

interface BusinessState {
	businesses: Business[];
	loading: boolean;
	error: string | null;

	// CRUD Form State
	initialCrudFormData?: Business | null;
	isOpenCrudForm: boolean;

	fetchBusinesses: (workspaceId: string) => Promise<void>;
	createBusiness: (data: Omit<Business, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
	deleteBusiness: (id: string) => Promise<void>;

	// CRUD Form Actions
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: Business) => void;
	onCloseCrudForm: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
	businesses: [],

	loading: true,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchBusinesses: async (workspaceId: string) => {
		set({ loading: true, error: null });
		const response = await getBusinesses({ workspaceId });
		if (response.success) {
			set({ businesses: response.data });
		} else {
			set({ error: response.error });
			toast.error("Failed to load Businesses");
		}
		set({ loading: false });
	},

	createBusiness: async (data) => {
		const response = await createBusiness({ data });
		if (response.success) {
			set((state) => ({
				businesses: [...state.businesses, response?.data ?? ({} as Business)],
			}));
			toast.success("Business created successfully");
		} else {
			console.error(response.error);
			toast.error("Failed to create Business");
		}
	},

	updateBusiness: async (id, data) => {
		const response = await updateBusiness({ id, data });
		if (response.success) {
			set((state) => ({
				businesses: state.businesses.map((item) =>
					item.id === id ? (response.data ?? ({} as Business)) : item,
				),
			}));
			toast.success("Business updated successfully");
		} else {
			console.error(response.error);
			toast.error("Failed to update Business");
		}
	},

	deleteBusiness: async (id) => {
		const response = await deleteBusiness({ id });
		if (response.success) {
			set((state) => ({
				businesses: state.businesses.filter((item) => item.id !== id),
			}));
			toast.success("Business deleted successfully");
		} else {
			console.error(response.error);
			toast.error("Failed to delete Business");
		}
	},
	onOpenCreateForm: () => {
		set({ isOpenCrudForm: true, initialCrudFormData: null });
	},

	onOpenEditForm: (data) => {
		set({ isOpenCrudForm: true, initialCrudFormData: data });
	},

	onCloseCrudForm: () => {
		set({ isOpenCrudForm: false, initialCrudFormData: null });
	},
}));
