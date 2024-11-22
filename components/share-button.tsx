"use client";
import React from "react";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";
import { Bot } from "@prisma/client";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

export const shareBot = async (bot: Bot) => {
	if (typeof window !== "undefined") {
		const orgin = window.location.origin;
		const shareData = {
			title: bot
				? `Try ${bot.name} - ${siteConfig.applicationName}`
				: `${siteConfig.applicationName}`,
			url: `${orgin}/chats/${bot?.id}/share`,
		};
		try {
			await window.navigator.share(shareData);
		} catch (error) {
			try {
				await window.navigator.clipboard
					.writeText(shareData.url)
					.then(() => toast.success("Bot link copied to clipboard"));
			} catch (error) {
				toast.error("Error sharing or copying the bot link");
			}
		}
	}
};

export default function ShareButton({ bot, disabled = false }: { bot: Bot; disabled?: boolean }) {
	return (
		<Button
			disabled={disabled}
			onClick={() => shareBot(bot)}
			className="w-full"
			variant={"ringHover"}
		>
			Share Bot Link <Share2 className="ml-2 size-4" />
		</Button>
	);
}
