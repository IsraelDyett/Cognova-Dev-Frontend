import { toast } from "sonner";
import { create } from "zustand";
import { debug } from "@/lib/utils";
import type { Business } from "@prisma/client";
import BusinessServerActions from "@/lib/actions/server/business";

interface BusinessState {
	businesses: Business[];
	loading: boolean;
	error: string | null;

	initialCrudFormData?: Business | null;
	isOpenCrudForm: boolean;

	fetchBusinesses: (workspaceId: string) => Promise<void>;
	createBusiness: (data: Omit<Business, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
	deleteBusiness: (id: string) => Promise<void>;

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
		debug("CLIENT", "fetchBusinesses", "STORE");
		set({ loading: true, error: null });
		const {
			data: businesses,
			success,
			error,
		} = await BusinessServerActions.getBusinesses({ workspaceId });
		if (success) {
			set({ businesses });
		} else {
			set({ error });
			toast.error("Failed to load Businesses");
		}
		set({ loading: false });
	},

	createBusiness: async (data) => {
		debug("CLIENT", "createBusiness", "STORE");
		const {
			data: business,
			success,
			error,
		} = await BusinessServerActions.createBusiness({ data });
		if (success) {
			set((state) => ({
				businesses: [...state.businesses, business],
			}));
			toast.success("Business created successfully");
		} else {
			toast.error(error);
		}
	},

	updateBusiness: async (id, data) => {
		debug("CLIENT", "updateBusiness", "STORE");
		const {
			data: business,
			success,
			error,
		} = await BusinessServerActions.updateBusiness({ id, data });
		if (success) {
			set((state) => ({
				businesses: state.businesses.map((item) => (item.id === id ? business : item)),
			}));
			toast.success("Business updated successfully");
		} else {
			toast.error(error);
		}
	},

	deleteBusiness: async (id) => {
		debug("CLIENT", "deleteBusiness", "STORE");
		const { success, error } = await BusinessServerActions.deleteBusiness({ id });
		if (success) {
			set((state) => ({
				businesses: state.businesses.filter((item) => item.id !== id),
			}));
			toast.success("Business deleted successfully");
		} else {
			toast.error(error);
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
