import React from 'react'
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Chat } from '@prisma/client';
import { ThumbsUp, ThumbsDown, Globe } from "lucide-react";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatBubbleCard({ chat }: { chat: Chat}) {
    return (
        <Card
            key={chat.id}
            className={`${chat.role === "assistant" ? "bg-secondary justify-start" : "bg-primary text-primary-foreground justify-end ml-auto"} my-2 max-w-[80%]`}
        >
            <CardHeader>
                <CardTitle className="text-sm flex justify-between">
                    <span className="font-medium capitalize">{chat.role}</span>
                    <span>{new Date(chat.createdAt).toLocaleString()}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
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
                {chat.role == "assistant" && (
                    <div className="mt-2 flex items-center space-x-2">
                        <ThumbsUp
                            className={`h-4 w-4 ${chat.feedback === "UPVOTED" ? "text-green-500" : "text-gray-500"}`}
                        />
                        <ThumbsDown
                            className={`h-4 w-4 ${chat.feedback === "DOWNVOTED" ? "text-red-500" : "text-gray-500"}`}
                        />
                    </div>
                )}
                {chat.sourceURLs.length > 0 && (
                    <div className="mt-2">
                        <strong>Sources:</strong>
                        <ul className="list-disc list-inside">
                            {chat.sourceURLs.map((url, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
