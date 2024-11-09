"use client";
import React from "react";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";
import { Bot } from "@prisma/client";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

export default function ShareButton({ bot, disabled = false }: { bot: Bot; disabled?: boolean }) {
  const shareBot = async () => {
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
            .writeText(`${shareData.title}\n\n ${shareData.url}`)
            .then(() => toast.success("Bot link copied to clipboard"));
        } catch (error) {
          toast.error("Error sharing and copying");
        }
      }
    }
  };
  return (
    <Button disabled={disabled} onClick={shareBot} className="w-full" variant={"ringHover"}>
      Share Bot Link <Share2 className="ml-2 size-4" />
    </Button>
  );
}
