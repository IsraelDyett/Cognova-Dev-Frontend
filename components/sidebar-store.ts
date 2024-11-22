import { create } from "zustand";
import {
	Brain,
	ChartArea,
	Cog,
	MessageSquareText,
	Settings2,
	SquareMousePointer,
	SquareTerminal,
} from "lucide-react";
import { Bot, Workspace } from "@prisma/client";
import { getWorkspaceBots, getWorkspaces } from "@/app/(workspace)/actions";
import { debug } from "@/lib/utils";

type LoadingState = "idle" | "loading" | "error" | "success";

interface LoadingStates {
	bots: LoadingState;
	workspaces: LoadingState;
}

interface ErrorStates {
	bots: string | null;
	workspaces: string | null;
}

interface SidebarStore {
	loadingStates: LoadingStates;
	errorStates: ErrorStates;

	workspaces: Workspace[];
	bots: Bot[];

	fetchWorkspaces: (userId: string) => Promise<void>;
	fetchBots: (workspaceId: string) => Promise<void>;

	setLoading: (feature: keyof LoadingStates) => void;
	setError: (feature: keyof ErrorStates, error: string) => void;
	setSuccess: (feature: keyof LoadingStates) => void;
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
	loadingStates: {
		bots: "idle",
		workspaces: "idle",
	},

	errorStates: {
		bots: null,
		workspaces: null,
	},

	workspaces: [],
	bots: [],

	setLoading: (feature) =>
		set((state) => ({
			loadingStates: {
				...state.loadingStates,
				[feature]: "loading",
			},
			errorStates: {
				...state.errorStates,
				[feature]: null,
			},
		})),

	setError: (feature, error) =>
		set((state) => ({
			loadingStates: {
				...state.loadingStates,
				[feature]: "error",
			},
			errorStates: {
				...state.errorStates,
				[feature]: error,
			},
		})),

	setSuccess: (feature) =>
		set((state) => ({
			loadingStates: {
				...state.loadingStates,
				[feature]: "success",
			},
		})),

	fetchWorkspaces: async (userId) => {
		debug("[STORE] {USE-SIDEBAR-STORE} FETCH WORKSPACES");
		const { setLoading, setError, setSuccess } = get();
		setLoading("workspaces");

		try {
			const workspaces = await getWorkspaces(userId, true);
			set({ workspaces });
			setSuccess("workspaces");
		} catch (error) {
			setError("workspaces", "Failed to load workspaces. Please try again.");
		}
	},

	fetchBots: async (workspaceId) => {
		debug("[STORE] {USE-SIDEBAR-STORE} FETCH BOTS");
		const { setLoading, setError, setSuccess } = get();
		setLoading("bots");

		try {
			const bots = await getWorkspaceBots(workspaceId);
			set({ bots: bots.data });
			setSuccess("bots");
		} catch (error) {
			setError("bots", "Failed to load bots. Please try again.");
		}
	},
}));

export const sidebarData = {
	mainNavigationMenus: [
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Workspace",
					url: "#",
				},
			],
		},
		{
			title: "Sources",
			url: "{after.workspaceId}/sources",
			icon: Brain,
		},
	],
	botNavigationMenus: [
		{
			title: "Sources",
			url: "{after.botId}/sources",
			icon: Brain,
		},
		{
			title: "Analytics",
			url: "{after.botId}/analytics",
			icon: ChartArea,
		},
		{
			title: "Playground",
			url: "{after.botId}/playground",
			icon: SquareTerminal,
		},
		{
			title: "Customize",
			url: "{after.botId}/customize",
			icon: Cog,
		},
		{
			title: "Chats",
			url: "{after.botId}/chats",
			icon: MessageSquareText,
		},
		{
			title: "Embed",
			url: "{after.botId}/customize",
			icon: SquareMousePointer,
		},
	],
	slideVariants: {
		enter: {
			x: 50,
			opacity: 0,
		},
		center: {
			x: 0,
			opacity: 1,
		},
		exit: {
			x: 100,
			opacity: 0,
		},
	},
	baseSlideVariants: {
		enter: {
			x: -100,
			opacity: 0,
		},
		center: {
			x: 0,
			opacity: 1,
		},
		exit: {
			x: -100,
			opacity: 0,
		},
	},
};
