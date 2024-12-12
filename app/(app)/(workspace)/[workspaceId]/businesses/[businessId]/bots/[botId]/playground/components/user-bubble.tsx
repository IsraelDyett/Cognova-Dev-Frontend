"use client";
import { MdContent } from "./md-content";
export const UserBubble = ({ content }: { content: string }) => {
	return (
		<li className="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
			<div className="grow text-end space-y-3">
				<div className="inline-block bg-primary rounded-lg p-3 shadow-sm [&>*]:text-white">
					<MdContent content={content} />
				</div>
			</div>
		</li>
	);
};
