"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspacePageProps } from "@/types";
import { CustomizeForm } from "./components/customize-form";
import { cBot, useCustomizeStore } from "./store";
import { ChatPreview } from "./components/chat-preview";
import { FormProvider } from "react-hook-form";

interface CustomizeFormValues {
  name: string;
  description: string;
  systemMessage: string;
  placeholderMessage: string;
  welcomeMessage: string;
  starterQuestions: string[];
  avatarURL: string;
  botChatAvatarURL: string;
  uMessageColor: string;
  aMessageColor: string;
  showSources: boolean;
  sendButtonText: string;
  customCSS: string;
  embedAngle: string;
  embedWidgetSize: string;
  embedWidgetIconURL: string;
  embedAutoOpen: boolean;
  embedPingMessage: string;
}

const getInitialFormValues = (bot: cBot | null): CustomizeFormValues => ({
  name: bot?.name || "",
  description: bot?.description || "",
  systemMessage: bot?.systemMessage || "",
  placeholderMessage: bot?.placeholderMessage || "Type your message...",
  welcomeMessage: bot?.welcomeMessage || "",
  starterQuestions: bot?.starterQuestions || [],
  avatarURL: bot?.configurations?.avatarURL || "",
  botChatAvatarURL: bot?.configurations?.botChatAvatarURL || "",
  uMessageColor: bot?.configurations?.uMessageColor || "#2563eb",
  aMessageColor: bot?.configurations?.aMessageColor || "#f1f5f9",
  showSources: bot?.configurations?.showSources ?? true,
  sendButtonText: bot?.configurations?.sendButtonText || "",
  customCSS: bot?.configurations?.customCSS || "",
  embedAngle: bot?.configurations?.embedAngle || "right",
  embedWidgetSize: bot?.configurations?.embedWidgetSize || "medium",
  embedWidgetIconURL: bot?.configurations?.embedWidgetIconURL || "",
  embedAutoOpen: bot?.configurations?.embedAutoOpen ?? false,
  embedPingMessage: bot?.configurations?.embedPingMessage || "",
});

const CustomizePage = ({ params }: WorkspacePageProps) => {
  const { bot, fetchBot } = useCustomizeStore();
  const methods = useForm<CustomizeFormValues>({
    defaultValues: getInitialFormValues(bot),
  });

  React.useEffect(() => {
    fetchBot(params.botId);
  }, [params.botId, fetchBot]);

  React.useEffect(() => {
    if (bot) {
      const botValues = getInitialFormValues(bot);
      methods.reset(botValues);
    }
  }, [bot, methods.reset]);

  return (
    <div className="container mx-auto p-4">
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <ChatPreview />
          <Card className="h-[78dvh] !p-2">
            <ScrollArea className="pr-4">
              <div className="max-h-[76dvh]">
                <CustomizeForm form={methods} />
              </div>
            </ScrollArea>
          </Card>
        </div>
      </FormProvider>
    </div>
  );
};

export default CustomizePage;
