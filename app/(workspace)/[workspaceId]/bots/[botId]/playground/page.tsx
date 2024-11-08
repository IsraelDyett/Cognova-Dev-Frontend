"use client";
import { cn } from "@/lib/utils";
import { useChatStore } from "./store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { handlePrompt, streamChat } from "./actions";
import { Send, AlertCircle, Bot, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WorkspacePageProps } from "@/types";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import SourcesDropdown from "./_components/sources-dropdown";

const CONVERSATION_ID = "4645b148-af9a-4518-9a1b-20b9aa2db4ab"; // Mock conversation ID

export default function PlaygroundPage(props: WorkspacePageProps) {
  const botId = props.params.botId;
  const inputRef = useRef<HTMLInputElement>(null);
  const chatsEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    isLoading,
    error,
    addChat,
    updateChat,
    removeChat,
    setError,
    setIsLoading,
    fetchInitialChats,
  } = useChatStore();

  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const initialChatRetrieved = React.useRef(false);
  useEffect(() => {
    if (!initialChatRetrieved.current) {
      fetchInitialChats(CONVERSATION_ID);
      initialChatRetrieved.current = true;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim() || isLoading) return;

    const userChat = inputRef.current.value;
    inputRef.current.value = "";

    addChat({
      content: userChat,
      role: "user",
    });

    const botChatId = addChat({
      content: "",
      role: "assistant",
    });

    setIsLoading(true);
    setError(null);

    try {
      const response = await handlePrompt({
        botId,
        chat: userChat,
        conversationId: CONVERSATION_ID,
      });
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("No response body");
      }
      await streamChat({
        reader: reader,
        botChatId: botChatId,
        updateChat: updateChat,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
      removeChat(botChatId);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow flex flex-col p-0">
          <ScrollArea className="px-3 sm:px-2 pb-4">
            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-2 h-[55vh]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex gap-3",
                    chat.role === "assistant"
                      ? "justify-start max-w-[80%]"
                      : "justify-end ml-auto max-w-[80%]",
                  )}
                >
                  {chat.role === "assistant" && (
                    <Avatar>
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm h-fit",
                        chat.role === "assistant"
                          ? "bg-secondary"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {(chat.content && (
                        <MemoizedReactMarkdown
                          className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
                          remarkPlugins={[remarkGfm, remarkMath]}
                          components={{
                            p({ children }) {
                              return <p className="mb-2 last:mb-0">{children}</p>;
                            },
                          }}
                        >
                          {chat.content}
                        </MemoizedReactMarkdown>
                      )) ||
                        (chat.role === "assistant" && isLoading && <LoadingDots />)}
                    </div>
                    <SourcesDropdown chat={chat} />
                  </div>
                </div>
              ))}
              <div ref={chatsEndRef} />
            </div>
          </ScrollArea>
          <div className="pb-2 pt-3 px-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                disabled={isLoading}
                className="flex-grow"
                placeholder="Type your message..."
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
