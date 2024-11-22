import { debug } from "@/lib/utils";

export const streamChat = async ({
	reader,
	updateChat,
	botChatId,
}: {
	reader: ReadableStreamDefaultReader<Uint8Array>;
	updateChat: (
		id: string,
		content: string,
		sourceUrls?: string[],
		questionSuggestions?: string[],
	) => void;
	botChatId: string;
}) => {
	debug("STREAM CHAT");
	let fullContent = "";
	let sourceUrls: string[] | undefined;
	let questionSuggestions: string[] | undefined;

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
					updateChat(botChatId, fullContent, sourceUrls, questionSuggestions);
				}
				if ("error" in data) {
					throw new Error(data.error);
				}
				if ("source_urls" in data) {
					sourceUrls = data.source_urls;
					updateChat(botChatId, fullContent, sourceUrls, questionSuggestions);
				}
				if ("question_suggestions" in data) {
					questionSuggestions = data.question_suggestions;
					updateChat(botChatId, fullContent, sourceUrls, questionSuggestions);
				}
			}
		}
	}
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
	debug("HANDLE PROMPT");
	const backendAPI = process.env.NEXT_PUBLIC_FAST_API_HOST || "https://api.cognova.io";
	const response = await fetch(`${backendAPI}/api/v1/bots/${botId}/chat/${conversationId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "text/event-stream",
		},
		body: JSON.stringify({ prompt: chat }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response;
};
