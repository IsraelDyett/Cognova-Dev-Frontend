import { create } from "zustand";
import { toast } from "sonner";
import { createBot, updateBot, deleteBot, listBots } from "./actions";
import { debug } from "@/lib/utils";
import type { Bot, Model } from "@prisma/client";
import { getModels } from "../../actions";

interface BotState {
	bots: Bot[];
	models: Model[];
	loading: boolean;
	error: string | null;

	// CRUD Form State
	initialCrudFormData?: Bot | null;
	isOpenCrudForm: boolean;

	fetchModels: () => Promise<void>;
	fetchBots: (workspaceId: string) => Promise<void>;
	createBot: (data: Omit<Bot, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateBot: (id: string, data: Partial<Bot>) => Promise<void>;
	deleteBot: (id: string) => Promise<void>;

	// CRUD Form Actions
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: Bot) => void;
	onCloseCrudForm: () => void;
}

export const useBotStore = create<BotState>((set) => ({
	bots: [],
	models: [],
	loading: true,
	error: null,

	initialCrudFormData: null,
	isOpenCrudForm: false,

	fetchBots: async (workspaceId: string) => {
		debug("CLIENT", "fetchBots", "CONTEXT");
		set({ loading: true, error: null });
		try {
			const response = await listBots({ where: { workspaceId } });
			if (response.success) {
				set({ bots: response.data });
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to load Bots");
		} finally {
			set({ loading: false });
		}
	},
	fetchModels: async () => {
		debug("CLIENT", "fetchModels", "CONTEXT");
		try {
			const response = await getModels();
			if (response.success) {
				set({ models: response.data });
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			toast.error("Failed to load models");
		}
	},
	createBot: async (data) => {
		debug("CLIENT", "createBot", "CONTEXT");
		try {
			const response = await createBot(data);
			if (response.success) {
				set((state) => ({
					bots: [...state.bots, response?.data ?? ({} as Bot)],
				}));
				toast.success("Bot created successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to create Bot");
		}
	},

	updateBot: async (id, data) => {
		debug("CLIENT", "updateBot", "CONTEXT");
		try {
			const response = await updateBot(id, data);
			if (response.success) {
				set((state) => ({
					bots: state.bots.map((item) =>
						item.id === id ? (response.data ?? ({} as Bot)) : item,
					),
				}));
				toast.success("Bot updated successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to update Bot");
		}
	},

	deleteBot: async (id) => {
		debug("CLIENT", "deleteBot", "CONTEXT");
		set({ loading: true, error: null });
		try {
			const response = await deleteBot(id);
			if (response.success) {
				set((state) => ({
					bots: state.bots.filter((item) => item.id !== id),
				}));
				toast.success("Bot deleted successfully");
			} else {
				throw new Error(response.error);
			}
		} catch (err: any) {
			const error: Error = err;
			set({ error: error.message });
			toast.error("Failed to delete Bot");
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
