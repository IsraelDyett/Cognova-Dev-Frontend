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
				pre: ({ children }) => <>{children}</>,
				ol: ({ node, children, ...props }) => {
					return (
						<ol className="list-decimal list-outside ml-4" {...props}>
							{children}
						</ol>
					);
				},
				li: ({ node, children, ...props }) => {
					return (
						<li className="py-1" {...props}>
							{children}
						</li>
					);
				},
				ul: ({ node, children, ...props }) => {
					return (
						<ul className="list-decimal list-outside ml-4" {...props}>
							{children}
						</ul>
					);
				},
				strong: ({ node, children, ...props }) => {
					return (
						<span className="font-semibold" {...props}>
							{children}
						</span>
					);
				},
				h1: ({ node, children, ...props }) => {
					return (
						<h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
							{children}
						</h1>
					);
				},
				h2: ({ node, children, ...props }) => {
					return (
						<h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
							{children}
						</h2>
					);
				},
				h3: ({ node, children, ...props }) => {
					return (
						<h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
							{children}
						</h3>
					);
				},
				h4: ({ node, children, ...props }) => {
					return (
						<h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
							{children}
						</h4>
					);
				},
				h5: ({ node, children, ...props }) => {
					return (
						<h5 className="text-base font-semibold mt-6 mb-2" {...props}>
							{children}
						</h5>
					);
				},
				h6: ({ node, children, ...props }) => {
					return (
						<h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
							{children}
						</h6>
					);
				},
			}}
		>
			{content.replace(/- \*\*Phone:\*\*/, "")}
		</MemoizedReactMarkdown>
	);
};
