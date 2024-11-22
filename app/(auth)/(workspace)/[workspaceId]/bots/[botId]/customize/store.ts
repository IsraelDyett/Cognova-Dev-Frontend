import { create } from "zustand";
import { Bot, BotConfiguration } from "@prisma/client";
import { retrieveBot } from "@/app/(auth)/(workspace)/actions";
import { debug } from "@/lib/utils";

export interface cBot extends Bot {
	configurations?: BotConfiguration;
}
interface CustomizeStore {
	bot: cBot | null;
	isLoading: boolean;
	fetchBot: (botId: string) => Promise<void>;
}

export const useCustomizeStore = create<CustomizeStore>((set) => ({
	bot: null,
	isLoading: true,
	fetchBot: async (botId) => {
		debug("CLIENT", "fetchBot", "STORE");
		set({ isLoading: true });
		try {
			const bot = await retrieveBot(botId);
			// @ts-ignore
			set({ bot, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
			});
		}
	},
}));
