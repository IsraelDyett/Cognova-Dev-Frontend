import { debug } from "@/lib/utils";
import { create } from "zustand";
import { toast } from "sonner";
import { createHour, updateHour, deleteHour, getHours } from "@/lib/actions/server/business";
import type { BusinessOperatingHours as Hour } from "@prisma/client";

interface HourState {
	hours: Hour[];
	loading: boolean;
	error: string | null;

	// CRUD Form State
	initialCrudFormData?: Hour | null;
	isOpenCrudForm: boolean;

	fetchHours: (workspaceId: string) => Promise<void>;
	createHour: (data: Omit<Hour, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateHour: (id: string, data: Partial<Hour>) => Promise<void>;
	deleteHour: (id: string) => Promise<void>;

	// CRUD Form Actions
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: Hour) => void;
	onCloseCrudForm: () => void;
}

export const useHourStore = create<HourState>((set) => ({
	hours: [],
	loading: true,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchHours: async (businessId: string) => {
		debug("CLIENT", "fetchHours", "STORE");
		set({ loading: true, error: null });
		try {
			const response = await getHours({ businessId, include: { location: true} });
			if (response.success) {
				set({ hours: response.data });
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to load Hours");
		} finally {
			set({ loading: false });
		}
	},
	createHour: async (data) => {
		debug("CLIENT", "createHour", "STORE");
		try {
			const response = await createHour({ data: data});
			if (response.success) {
				set((state) => ({
					hours: [...state.hours, response?.data ?? ({} as Hour)],
				}));
				toast.success("Hour created successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to create Hour");
		}
	},

	updateHour: async (id, data) => {
		debug("CLIENT", " updateHour", "STORE");
		try {
			const response = await updateHour({id, data});
			if (response.success) {
				set((state) => ({
					hours: state.hours.map((item) =>
						item.id === id ? (response.data ?? ({} as Hour)) : item,
					),
				}));
				toast.success("Hour updated successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to update Hour");
		}
	},

	deleteHour: async (id) => {
		debug("CLIENT", " deleteHour", "STORE");
		set({ loading: true, error: null });
		try {
			const response = await deleteHour({id});
			if (response.success) {
				set((state) => ({
					hours: state.hours.filter((item) => item.id !== id),
				}));
				toast.success("Hour deleted successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to delete Hour");
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
