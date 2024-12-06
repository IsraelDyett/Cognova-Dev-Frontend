import { BusinessConfigForm } from "./components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { retrieveBusinessConfig } from "@/lib/actions/server/business";
import { WorkspacePageProps } from "@/types";

export default async function BusinessConfigPage(props: WorkspacePageProps) {
	const { data: businessConfig, error } = await retrieveBusinessConfig({
		businessId: props.params.businessId,
	});
	if (error) return <div>Something went wrong</div>;
	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle>General Settings</CardTitle>
					<CardDescription>
						Manage your business&apos;s general configuration settings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<BusinessConfigForm businessConfig={businessConfig} />
				</CardContent>
			</Card>
		</div>
	);
}
