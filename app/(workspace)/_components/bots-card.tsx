import React from 'react'
import { MessageSquare, Database, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
type Bot = {
    id: string
    name: string
    workspace: string
    chats: number
    sources: number
    model: string
    updated: Date
    created: Date
    image: string
}
export default function BotCard({ bot }: { bot: Bot }) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date)
    }
    return (
        <Card key={bot.id} className="flex flex-col">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={bot.image} alt={bot.name} />
                        <AvatarFallback>{bot.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{bot.name}</CardTitle>
                        <CardDescription>{bot.workspace}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Chats: {bot.chats}</span>
                    </div>
                    <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        <span>Sources: {bot.sources}</span>
                    </div>
                    <div className="col-span-2">Model: {bot.model}</div>
                    <div className="col-span-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Updated: {formatDate(bot.updated)}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Created: {formatDate(bot.created)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
