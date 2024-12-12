import { debug } from "@/lib/utils";

export const streamChat = async ({
	reader,
	updateChat,
	botChatId,
	setAction,
	setSuggestions,
	onFinish,
}: {
	reader: ReadableStreamDefaultReader<Uint8Array>;
	setAction: (action: any) => void;
	setSuggestions: (suggestions: string[]) => void;
	updateChat: (id: string, content: string) => void;
	botChatId: string;
	onFinish: () => void;
}) => {
	debug("CLIENT", "streamChat", "UTILS-FUNC");
	let fullContent = "";

	const decoder = new TextDecoder();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		const lines = chunk.split("\n");
		for (const line of lines) {
			if (line.startsWith("data: ")) {
				const data = JSON.parse(line.slice(5));
				if ("token" in data) {
					fullContent += data.token;
					updateChat(botChatId, fullContent);
				}
				if ("action" in data) {
					setAction(data.action);
				}
				if ("complete" in data) {
					onFinish();
				}
				if ("error" in data) {
					onFinish();
					throw new Error(data.error);
				}
				if ("suggestions" in data) {
					setSuggestions(data.suggestions);
				}
			}
		}
	}
	onFinish();
};

export const handlePrompt = async ({
	botId,
	chat,
	conversationId,
}: {
	botId: string;
	chat: string;
	conversationId: string;
}) => {
	debug("CLIENT", "handlePrompt", "UTILS-FUNC");
	const backendAPI = process.env.NEXT_PUBLIC_FAST_API_HOST || "https://api.cognova.io/api/v1";
	const response = await fetch(`${backendAPI}/bots/${botId}/chat/${conversationId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "text/event-stream",
		},
		body: JSON.stringify({ prompt: chat, chat_mode: "web" }),
	});

	if (!response.ok) {
		console.error("ERROR", response);
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response;
};
