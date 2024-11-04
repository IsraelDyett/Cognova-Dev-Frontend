"use client";
import { cn } from '@/lib/utils'
import { useChatStore } from './store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useRef, useEffect } from 'react'
import LoadingDots from '@/components/ui/loading-dots'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { handlePrompt, streamMessage } from './actions'
import { Send, AlertCircle, Bot, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { WorkspacePageProps } from '@/types';

const CONVERSATION_ID = 'a3c554b0-3ed1-4a31-8154-6082df342da1' // Mock conversation ID

export default function PlaygroundPage(props: WorkspacePageProps) {
    const botId = props.params.bot_uuid
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const {
        messages,
        isLoading,
        error,
        addMessage,
        updateMessage,
        removeMessage,
        setError,
        setIsLoading
    } = useChatStore()

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputRef.current?.value.trim() || isLoading) return

        const userMessage = inputRef.current.value
        inputRef.current.value = ''

        const userMessageId = addMessage({
            content: userMessage,
            role: 'user'
        })

        const botMessageId = addMessage({
            content: '',
            role: 'bot'
        })

        setIsLoading(true)
        setError(null)

        try {
            const response = await handlePrompt({
                botId,
                message: userMessage,
                conversationId: CONVERSATION_ID,
            })
            const reader = response.body?.getReader()

            if (!reader) {
                throw new Error('No response body')
            }
            await streamMessage({
                reader: reader,
                botMessageId: botMessageId,
                updateMessage: updateMessage
            })
        } catch (err) {
            console.error('Chat error:', err)
            setError(err instanceof Error ? err.message : 'Failed to get response')
            removeMessage(botMessageId)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col max-w-4xl mx-auto">
            <Card className="flex-grow flex flex-col">
                <CardContent className="flex-grow flex flex-col gap-4 px-0 sm:px-2 py-4">
                    <ScrollArea className='px-3'>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4 pb-2 h-[55vh]">
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
                                            <AvatarFallback>
                                                <Bot className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={cn(
                                            "rounded-lg px-4 py-2 text-sm h-fit",
                                            message.role === 'bot'
                                                ? "bg-secondary"
                                                : "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        {message.content || (
                                            message.role === 'bot' && isLoading && (
                                                <LoadingDots />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

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
                </CardContent>
            </Card>
        </div>
    )
}