import React from "react";
import BusinessDashboard from "./businesses/page";
// import { CreateBot } from "../components/create-bot";

export const revalidate = 10;
export default async function WorkspaceOverviewPage() {
	// return (
	// 	<div className="flex-1 h-full justify-center flex items-center">{/* <CreateBot /> */}</div>
	// );
	return <BusinessDashboard />;
}
