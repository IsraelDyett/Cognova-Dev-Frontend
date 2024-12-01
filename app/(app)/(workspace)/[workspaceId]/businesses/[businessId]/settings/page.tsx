import { BusinessConfigForm } from "./components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { retrieveBusinessConfig } from "@/lib/actions/server/business";
import { WorkspacePageProps } from "@/types";
import { Settings, Store, DollarSign } from "lucide-react";

export default async function BusinessConfigPage(props: WorkspacePageProps) {
	const { data: businessConfig, error } = await retrieveBusinessConfig({
		businessId: props.params.businessId,
	});
	if (error || !businessConfig) return <div>Error: {error}</div>;
	return (
		<div className="container mx-auto p-4">
			<Tabs defaultValue="general" className="space-y-4">
				<TabsList>
					<TabsTrigger value="general">
						<Store className="mr-2 h-4 w-4" />
						General
					</TabsTrigger>
					<TabsTrigger value="financial">
						<DollarSign className="mr-2 h-4 w-4" />
						Financial
					</TabsTrigger>
					<TabsTrigger value="advanced">
						<Settings className="mr-2 h-4 w-4" />
						Advanced
					</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
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
				</TabsContent>
				<TabsContent value="financial">
					<Card>
						<CardHeader>
							<CardTitle>Financial Settings</CardTitle>
							<CardDescription>
								Manage your business&apos;s financial settings and integrations.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Financial settings content goes here.</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="advanced">
					<Card>
						<CardHeader>
							<CardTitle>Advanced Settings</CardTitle>
							<CardDescription>
								Configure advanced options for your business.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Advanced settings content goes here.</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
