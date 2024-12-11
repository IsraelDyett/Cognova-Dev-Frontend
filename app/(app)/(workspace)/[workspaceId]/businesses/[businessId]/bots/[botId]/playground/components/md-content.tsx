"use client";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { ExternalLink } from "lucide-react";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";

export const MdContent = ({ content }: { content: string }) => {
	return (
		<MemoizedReactMarkdown
			className="prose break-words prose-p:leading-relaxed prose-pre:p-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:rounded-md [&_a]:bg-secondary [&_a]:px-2 [&_a]:py-1 [&_a]:text-xs [&_a]:no-underline hover:[&_a]:bg-secondary/80"
			remarkPlugins={[remarkGfm, remarkMath]}
			components={{
				p({ children }) {
					return <p className="mb-2 last:mb-0 text-sm">{children}</p>;
				},
				a(props) {
					if (props.href?.startsWith("tel:")) return null;
					return (
						<a
							href={props.href}
							className="truncate text-sm text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium"
							target="_blank"
							rel="noopener noreferrer"
						>
							{props.children}
							<ExternalLink className="h-3 w-3" />
						</a>
					);
				},
				img() {
					return null;
				},
			}}
		>
			{content.replace(/- \*\*Phone:\*\*/, "")}
		</MemoizedReactMarkdown>
	);
};
