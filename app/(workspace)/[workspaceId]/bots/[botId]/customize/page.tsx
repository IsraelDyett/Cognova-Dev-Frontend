"use client";
import React from 'react';
import { useForm } from "react-hook-form"
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { WorkspacePageProps } from '@/types';
import { CustomizeForm } from './_components/customize-form';
import { cBot, useCustomizeStore } from './store';

const messages = [
    {
        id: "123",
        content: "Hello, How can i assist you today ?",
        role: 'bot',
        timestamp: new Date()
    },
    {
        id: "1234",
        content: "Nothing",
        role: 'user',
        timestamp: new Date()
    }
]

const setInitialFormValues = (bot: cBot | null) => {
    return {
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
    }
}
const CustomizePage = (props: WorkspacePageProps) => {
    const { bot, fetchBot } = useCustomizeStore()
    const form = useForm({
        defaultValues: setInitialFormValues(bot)
    })
    React.useEffect(() => {
        const botId = props.params.botId;
        fetchBot(botId);
    }, [props.params.botId, fetchBot]);
    React.useEffect(() => {
        if (bot) {
            const botValues = setInitialFormValues(bot)
            console.log(botValues)
            form.reset(botValues);
        }
    }, [bot, form.reset]);
    return (
        <div className="container mx-auto p-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Card className="h-[78vh] flex flex-col">
                    <CardHeader>
                        <CardTitle>Chat Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col gap-4 p-0">
                        <ScrollArea className="flex-grow p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.role === 'bot'
                                                ? "justify-start max-w-[80%]"
                                                : "justify-end ml-auto max-w-[80%]"
                                        )}
                                    >
                                        {message.role === 'bot' && (
                                            <Avatar>
                                                <AvatarImage src={form.watch("botChatAvatarURL")} />
                                                <AvatarFallback>
                                                    <Bot className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                        style={{ backgroundColor : message.role === "bot" ? form.watch("aMessageColor"): form.watch("uMessageColor")}}
                                            className={cn(
                                                "rounded-lg px-4 py-2 text-sm",
                                                message.role === 'bot'
                                                    ? `bg-secondary`
                                                    : "bg-primary text-primary-foreground"
                                            )}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <form className="flex gap-2">
                                <Input
                                    className="flex-grow"
                                    placeholder={form.watch("placeholderMessage") || "Type your message..."}
                                />
                                <Button>
                                    {form.getValues("sendButtonText").length > 0 ? (
                                        form.watch("sendButtonText")
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-[78vh] !p-2">
                    <ScrollArea className='pr-4'>
                        <div className="max-h-[76vh]">
                            <CustomizeForm form={form} />
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
};

export default CustomizePage;