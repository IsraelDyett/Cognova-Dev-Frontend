import { create } from "zustand";
import {
	Brain,
	ChartArea,
	Cog,
	MessageSquareText,
	Settings2,
	SquareMousePointer,
	SquareTerminal,
	Building,
	BarChartIcon as ChartBar,
	ShoppingBag,
	MapPin,
	Clock,
	Settings,
	Bot,
	Stars,
} from "lucide-react";
import { Workspace } from "@prisma/client";
import { getWorkspaces } from "@/app/(auth)/(workspace)/actions";
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

	fetchWorkspaces: (userId: string) => Promise<void>;

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
		debug("CLIENT", "fetchWorkspaces", "STORE");
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
}));

export const sidebarData = {
	mainNavigationMenus: [
		{
			title: "Overview",
			url: `/`,
			icon: Stars,
			isActive: true,
		},
		{
			title: "Businesses",
			url: "/businesses",
			icon: Building,
		},
		{
			title: "Bots",
			url: "/bots",
			icon: Bot,
		},
		{
			title: "Sources",
			url: "/sources",
			icon: Brain,
		},
	],
	businessNavigationMenus: [
		{
			title: "Overview",
			icon: Building,
			url: "businesses/{businessId}/",
		},
		{
			title: "Analytics",
			icon: ChartBar,
			url: "businesses/{businessId}/analytics",
		},
		{
			title: "Products",
			icon: ShoppingBag,
			url: "businesses/{businessId}/products",
		},
		{
			title: "Locations",
			icon: MapPin,
			url: "businesses/{businessId}/locations",
		},
		{
			title: "Operating Hours",
			icon: Clock,
			url: "businesses/{businessId}/hours",
		},
		{
			title: "Settings",
			icon: Settings,
			url: "businesses/{businessId}/settings",
		},
	],
	botNavigationMenus: [
		// {
		// 	title: "Sources",
		// 	url: "bots/{botId}/sources",
		// 	icon: Brain,
		// },
		{
			title: "Analytics",
			url: "bots/{botId}/analytics",
			icon: ChartArea,
		},
		{
			title: "Playground",
			url: "bots/{botId}/playground",
			icon: SquareTerminal,
		},
		{
			title: "Customize",
			url: "bots/{botId}/customize",
			icon: Cog,
		},
		{
			title: "Chats",
			url: "bots/{botId}/chats",
			icon: MessageSquareText,
		},
		// {
		// 	title: "Embed",
		// 	url: "bots/{botId}/customize",
		// 	icon: SquareMousePointer,
		// },
	],
	workspaceNavigationMenus: [
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
