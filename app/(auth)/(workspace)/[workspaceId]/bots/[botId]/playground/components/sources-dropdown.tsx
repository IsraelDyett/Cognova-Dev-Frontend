import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChatFeedback } from "@prisma/client";

interface Chat {
	id: string;
	conversationId?: string;
	role: "user" | "assistant";
	content: string;
	tokens?: number;
	feedback?: ChatFeedback;
	sourceURLs?: string[];
	questionSuggestions?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export default function SourcesDropdown({ chat }: { chat: Chat }) {
	return (
		<>
			{chat.role == "assistant" && (chat.sourceURLs?.length || 0) > 0 && (
				<Collapsible className="pb-6">
					<CollapsibleTrigger>
						<Badge className="text-xs" variant={"outline"}>
							Sources
						</Badge>
					</CollapsibleTrigger>
					<CollapsibleContent className="divide-x-2 space-x-3">
						{chat.sourceURLs?.map((url) => {
							return (
								<a
									href={url}
									target="_blank"
									className="text-xs px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
									key={url}
								>
									{url}
								</a>
							);
						})}
					</CollapsibleContent>
				</Collapsible>
			)}
		</>
	);
}
