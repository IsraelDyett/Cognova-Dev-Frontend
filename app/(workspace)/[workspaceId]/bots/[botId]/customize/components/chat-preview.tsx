import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const messages = [
  {
    id: "123",
    content: "Hello, How can i assist you today ?",
    role: "bot",
    timestamp: new Date(),
  },
  {
    id: "1234",
    content: "Nothing",
    role: "user",
    timestamp: new Date(),
  },
];

export const ChatPreview = () => {
  const { watch, getValues } = useFormContext();

  const renderMessage = (message: (typeof messages)[0]) => {
    const isBot = message.role === "bot";
    const backgroundColor = isBot ? watch("aMessageColor") : watch("uMessageColor");

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3",
          isBot ? "justify-start max-w-[80%]" : "justify-end ml-auto max-w-[80%]",
        )}
      >
        {isBot && (
          <Avatar>
            <AvatarImage src={watch("botChatAvatarURL")} />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          style={{ backgroundColor }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isBot ? "bg-secondary" : "bg-primary text-primary-foreground",
          )}
        >
          {message.content}
        </div>
      </div>
    );
  };

  const renderChatInput = () => (
    <form className="flex gap-2">
      <Input
        className="flex-grow"
        placeholder={watch("placeholderMessage") || "Type your message..."}
      />
      <Button>{getValues("sendButtonText") || <Send className="h-4 w-4" />}</Button>
    </form>
  );

  return (
    <Card className="h-[78dvh] flex flex-col">
      <CardHeader>
        <CardTitle>Chat Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 p-0">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">{messages.map(renderMessage)}</div>
        </ScrollArea>
        <div className="pb-2 pt-3 px-3 border-t">{renderChatInput()}</div>
      </CardContent>
    </Card>
  );
};
