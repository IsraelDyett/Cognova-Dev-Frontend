import { toast } from "sonner";
import { create } from "zustand";
import { debug } from "@/lib/utils";
import type { Bot } from "@prisma/client";
import BotServerActions from "@/lib/actions/server/bot";

interface BotState {
	bots: Bot[];
	loading: "bots" | "none" | "initial";
	error: string | null;

	isOpenCrudForm: boolean;
	initialCrudFormData?: Bot | null;

	deleteBot: (id: string) => Promise<void>;
	fetchBots: (workspaceId: string) => Promise<void>;
	updateBot: (id: string, data: Partial<Bot>) => Promise<void>;
	createBot: (data: Omit<Bot, "id" | "createdAt" | "updatedAt">) => Promise<void>;

	onCloseCrudForm: () => void;
	onOpenCreateForm: () => void;
	onOpenEditForm: (data: Bot) => void;
}

export const useBotStore = create<BotState>((set) => ({
	bots: [],
	loading: "initial",
	error: null,

	isOpenCrudForm: false,
	initialCrudFormData: null,

	fetchBots: async (workspaceId: string) => {
		debug("CLIENT", "fetchBots", "STORE");
		set({ loading: "bots", error: null });
		const {
			data: bots,
			success,
			error,
		} = await BotServerActions.getBots({ workspaceId: workspaceId });
		if (success) {
			set({ bots: bots });
		} else {
			set({ error: error });
			toast.error("Failed to load Bots");
		}
		set({ loading: "none" });
	},
	createBot: async (data) => {
		debug("CLIENT", "createBot", "CONTEXT");
		const { data: createdBotData, success, error } = await BotServerActions.createBot({ data });
		if (success) {
			set((state) => ({
				bots: [...state.bots, createdBotData.bot],
			}));
			toast.success("Bot created successfully");
		} else {
			toast.error("Failed to create Bot");
		}
	},

	updateBot: async (id, data) => {
		debug("CLIENT", "updateBot", "CONTEXT");
		const {
			data: updatedBotData,
			success,
			error,
		} = await BotServerActions.updateBot({ botId: id, data });
		if (success) {
			set((state) => ({
				bots: state.bots.map((item) => (item.id === id ? updatedBotData : item)),
			}));
			toast.success("Bot updated successfully");
		} else {
			toast.error("Failed to update Bot");
		}
	},

	deleteBot: async (id) => {
		debug("CLIENT", "deleteBot", "CONTEXT");
		const { success, error } = await BotServerActions.deleteBot({ botId: id });
		if (success) {
			set((state) => ({
				bots: state.bots.filter((item) => item.id !== id),
			}));
			toast.success("Bot deleted successfully");
		} else {
			toast.error("Failed to delete Bot");
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
