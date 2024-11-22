"use client";
import { useEffect } from "react";
import { Settings2, AlertCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { associateSourceWithBot, deassociateSourceFromBot } from "../bots/[botId]/actions";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSourceBots } from "./store";
import { WorkspacePageProps } from "@/types";
import { getWorkspaceBots, getWorkspaceSources } from "@/app/(auth)/(workspace)/actions";

const Page = (props: WorkspacePageProps) => {
	const { workspaceId } = props.params;
	const {
		sources,
		workspaceBots,
		isLoading,
		error,
		setSources,
		setWorkspaceBots,
		setLoading,
		setError,
	} = useSourceBots();

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const [sourcesRes, botsRes] = await Promise.all([
					getWorkspaceSources(workspaceId, true),
					getWorkspaceBots(workspaceId),
				]);

				if (sourcesRes.success && botsRes.success) {
					setSources(sourcesRes.data);
					setWorkspaceBots(botsRes.data);
				} else {
					setError("Failed to load data");
				}
			} catch (err) {
				setError("An error occurred while loading data");
			}
			setLoading(false);
		};

		loadData();
	}, [workspaceId]);

	const handleToggleBot = async (
		sourceId: string,
		botId: string,
		currentlyAssociated: boolean,
	) => {
		try {
			const result = currentlyAssociated
				? await deassociateSourceFromBot(sourceId, botId)
				: await associateSourceWithBot(sourceId, botId);

			if (result.success) {
				const sourcesRes = await getWorkspaceSources(workspaceId, true);
				if (sourcesRes.success) {
					setSources(sourcesRes.data);
					toast.success(
						`Source ${currentlyAssociated ? "removed from" : "added to"} bot successfully`,
					);
				}
			} else {
				throw new Error("Failed to update association");
			}
		} catch (error) {
			toast.error(
				`Failed to ${currentlyAssociated ? "remove" : "add"} source ${currentlyAssociated ? "from" : "to"} bot`,
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div>
			<div>
				<h1 className="text-2xl font-semibold text-foreground mb-2">
					Manage Source Bot Associations
				</h1>
				<p className="text-muted-foreground mb-8">
					Configure which bots can access each source
				</p>
			</div>
			<Card className="w-full">
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Source Name</TableHead>
								<TableHead>Associated Bots</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sources.map((source) => (
								<TableRow key={source.id}>
									<TableCell className="font-medium">{source.url}</TableCell>
									<TableCell>
										{source.bots.map((bs) => bs.bot.name).join(", ") || "None"}
									</TableCell>
									<TableCell className="text-right">
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="outline" size="sm">
													<Settings2 className="h-4 w-4 mr-2" />
													Manage Bots
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Manage Bots for {source.url}
													</DialogTitle>
													<DialogDescription>
														Select which bots can access this source
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4">
													{workspaceBots.map((bot) => {
														const isAssociated = source.bots.some(
															(bs) => bs.bot.id === bot.id,
														);
														return (
															<div
																key={bot.id}
																className="flex items-center space-x-2"
															>
																<Checkbox
																	id={`bot-${bot.id}`}
																	checked={isAssociated}
																	onCheckedChange={() => {
																		handleToggleBot(
																			source.id,
																			bot.id,
																			isAssociated,
																		);
																	}}
																/>
																<label
																	htmlFor={`bot-${bot.id}`}
																	className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																>
																	{bot.name}
																</label>
															</div>
														);
													})}
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

export default Page;
