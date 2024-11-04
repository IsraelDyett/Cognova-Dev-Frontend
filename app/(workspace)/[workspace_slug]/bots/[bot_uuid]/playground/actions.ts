export const streamMessage = async ({
    reader,
    updateMessage,
    botMessageId,
}: {
    reader: ReadableStreamDefaultReader<Uint8Array>,
    updateMessage: (id: string, content: string) => void
    botMessageId: string
}) => {
    let fullContent = ''
    const decoder = new TextDecoder()
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(5))
                    fullContent += data.token
                    updateMessage(botMessageId, fullContent)
                } catch (e) {
                    console.error('Error parsing streaming data:', e)
                }
            }
        }
    }
}

export const handlePrompt = async ({
    botId,
    message,
    conversationId,
}: {
    botId: string,
    message: string
    conversationId: string,
}) => {
    const backendAPI = process.env.NEXT_PUBLIC_BACKEND_API || "http://127.0.0.1:8000/api/v1"
    const response = await fetch(`${backendAPI}/bots/${botId}/chat/${conversationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ prompt: message }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
}