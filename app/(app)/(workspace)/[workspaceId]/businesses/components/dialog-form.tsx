import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function DialogForm({
	isOpenCrudForm,
	onCloseCrudForm,
	children,
	title,
	description,
}: {
	isOpenCrudForm: boolean;
	onCloseCrudForm: () => void;
	title: string;
	description: string;
} & React.PropsWithChildren) {
	return (
		<Dialog open={isOpenCrudForm} onOpenChange={onCloseCrudForm}>
			<DialogContent size={"4xl"}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
