import { BusinessConfigForm } from "./components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { retrieveBusinessConfig } from "@/lib/actions/server/business";
import { WorkspacePageProps } from "@/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export default async function BusinessConfigPage(props: WorkspacePageProps) {
	const { data: businessConfig, error } = await retrieveBusinessConfig({
		businessId: props.params.businessId,
	});
	if (error) return <div>Something went wrong</div>;
	return (
		<section>
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
			<Card className="border-red-200 bg-red-50 mt-6">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-red-600" />
						<CardTitle className="text-red-600">Danger Zone</CardTitle>
					</div>
					<CardDescription>
						By deleting this business, you will delete all the data associated with it
						(bots, products).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<Trash2 className="h-4 w-4 text-destructive-foreground mr-2" />
								Delete Business
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Business</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this business? This action
									cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</section>
	);
}
