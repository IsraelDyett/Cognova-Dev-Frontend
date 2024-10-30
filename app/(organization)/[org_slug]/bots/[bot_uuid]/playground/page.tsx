'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PlaygroundPage() {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the input to your bot API
        setResponse(`Bot response to: ${input}`)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Playground</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full"
                />
                <Button type="submit">Send</Button>
            </form>
            {response && (
                <div className="mt-4 p-4 bg-white rounded shadow">
                    <h3 className="font-bold mb-2">Bot Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    )
}