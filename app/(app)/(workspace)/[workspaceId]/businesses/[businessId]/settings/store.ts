import { debug } from "@/lib/utils";
import { create } from "zustand";
import { toast } from "sonner";
import { retrieveBusinessConfig, updateOrCreateBusinessConfig } from "@/lib/actions/server/business";
import type { BusinessConfig, Prisma } from "@prisma/client";

interface BusinessConfigState {
	settings: BusinessConfig | null;
	loading: boolean;
	error: string | null;

	// CRUD Form State
	initialCrudFormData?: BusinessConfig | null;
	isOpenCrudForm: boolean;

	updateOrCreateBusinessConfig: (businessId: string, data: Prisma.BusinessConfigUncheckedCreateInput) => Promise<void>;
	// CRUD Form Actions
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: BusinessConfig) => void;
	onCloseCrudForm: () => void;
}

export const useBusinessConfigStore = create<BusinessConfigState>((set) => ({
	settings: null,
	loading: true,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchBusinessConfigs: async (businessId: string) => {
		debug("CLIENT", "fetchBusinessConfigs", "STORE");
		set({ loading: true, error: null });
		try {
			const response = await retrieveBusinessConfig({businessId});
			if (response.success) {
				set({ settings: response.data });
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to load BusinessConfigs");
		} finally {
			set({ loading: false });
		}
	},
	updateOrCreateBusinessConfig: async (businessId, data) => {
		debug("CLIENT", "createBusinessConfig", "STORE");
		try {
			const response = await updateOrCreateBusinessConfig({businessId, data});
			if (response.success) {
				set({ settings: response?.data });
				toast.success("BusinessConfig created successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to create BusinessConfig");
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
