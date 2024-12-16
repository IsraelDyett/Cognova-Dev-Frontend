"use client";
import React from "react";
import CreateWorkspaceDialog from "./components/create-workspace-dialog";
import dynamic from "next/dynamic";

export default function OnBoardingPage() {
	const CreateBusinessModal = dynamic(() => import("../(workspace)/[workspaceId]/businesses/components/form")
		.then((mod) => mod.BusinessForm), { ssr: false })

	const CreateProductsModal = dynamic(() =>
		import("../(workspace)/[workspaceId]/businesses/[businessId]/products/components/form")
			.then((mod) => mod.ProductForm), { ssr: false })

	const CreateBotModal = dynamic(() =>
		import("../(workspace)/[workspaceId]/businesses/[businessId]/bots/components/form")
			.then((mod) => mod.BotForm), { ssr: false })

	return (
		<CreateWorkspaceDialog />
	);
}
