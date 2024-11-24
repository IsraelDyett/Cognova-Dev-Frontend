"use client";

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
import { useEffect, useState } from "react";
import { useBusinessStore } from "../store";
import { retrieveBusiness } from "../actions";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import LoadingPageSpinner from "@/components/skeletons/loading-page-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { Store, Truck, ShoppingBag, AlertTriangle, Settings, Trash2 } from "lucide-react";

export default function BusinessDetail() {
	const router = useRouter();
	const params = useParams();
	const { workspace } = useWorkspace();
	const [currentBusiness, setCurrentBusiness] = useState<any>(null);
	const { fetchBusinesses, deleteBusiness } = useBusinessStore();

	useEffect(() => {
		if (params.businessId) {
			retrieveBusiness(params.businessId as string).then((res) => {
				setCurrentBusiness(res.data);
			});
		}
	}, [params.businessId, fetchBusinesses]);

	if (!currentBusiness) return <LoadingPageSpinner />;

	const handleDeleteBusiness = async () => {
		await deleteBusiness(currentBusiness.id);
		router.push(`/${workspace?.name}/businesses`);
	};

	return (
		<div className="container mx-auto p-4 space-y-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Store className="w-8 h-8" />
					<h1 className="text-3xl font-bold">{currentBusiness.name}</h1>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Business Type</CardTitle>
						<Store className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{currentBusiness.type}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Delivery</CardTitle>
						<Truck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{currentBusiness.hasDelivery ? "Available" : "Not Available"}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Business Configuration */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Settings className="w-5 h-5" />
						<CardTitle>Business Configuration</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Currency</p>
						<p className="font-medium">{currentBusiness.configurations?.currency}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Delivery Fee</p>
						<p className="font-medium">
							${currentBusiness.configurations?.deliveryFee || "N/A"}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Min Order Amount</p>
						<p className="font-medium">
							${currentBusiness.configurations?.minOrderAmount || "N/A"}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Tax Rate</p>
						<p className="font-medium">{currentBusiness.configurations?.taxRate}%</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Return Period</p>
						<p className="font-medium">
							{currentBusiness.configurations?.returnPeriodDays || "N/A"} days
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Warranty Period</p>
						<p className="font-medium">
							{currentBusiness.configurations?.warrantyPeriodDays || "N/A"} days
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<Card className="border-red-200 bg-red-50">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-red-600" />
						<CardTitle className="text-red-600">Danger Zone</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<Trash2 className="mr-2 h-4 w-4 text-destructive" />
								Delete Business
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Business</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this business? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleDeleteBusiness()}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	);
}
