"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Building2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { debug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createWorkspaceWithTeam } from "../actions";
import InviteToWorkspaceForm from "./invite-to-workspace-form";
import { useWorkspaceStore } from "../store";
import { getRoles } from "@/app/actions";

export default function CreateWorkspaceDialog({ customTrigger }: { customTrigger?: React.ReactNode }) {
	const { isOpen, isLoading, formData, setOpen, setLoading, removeTeamMember, roles, reset, setRoles } =
		useWorkspaceStore();

	const router = useRouter();
	const [error, setError] = React.useState("");
	const [workspaceName, setWorkspaceName] = React.useState("");

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setWorkspaceName("");
			setError("");
			reset();
		}
		setOpen(open);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!workspaceName.trim()) {
			setError("Workspace name is required");
			return;
		}
		try {
			setLoading(true);
			const result = await createWorkspaceWithTeam({
				displayName: workspaceName.trim(),
				team: formData.team,
			});

			if (result.success) {
				handleOpenChange(false);
				toast.success("Workspace created successfully");
				window.location.assign(`/${result.workspaceId}`);
			}
			if (!result.success) {
				setError(result.error || "Failed to create workspace");
			}
		} catch (error) {
			console.error("Error creating workspace:", error);
			setError("Failed to create workspace");
		} finally {
			setLoading(false);
		}
	};
	React.useEffect(() => {
		const loadRoles = async () => {
			debug("CLIENT", "loadRoles", "PAGE");
			const roles = await getRoles();
			setRoles(roles);
		};
		if(roles.length  === 0) {
			loadRoles();
		}
	}, [setRoles]);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{customTrigger ? customTrigger : (
					<Button type="button">
						<Building2 className="mr-2 h-4 w-4" />
						Create Workspace
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Create New Workspace</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium">Workspace Name</label>
						<Input
							placeholder="Enter workspace name"
							value={workspaceName}
							onChange={(e) => {
								setWorkspaceName(e.target.value);
								setError("");
							}}
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>

					<div className="space-y-4">
						<label className="text-sm font-medium">Team Members</label>
						<InviteToWorkspaceForm />
						<div className="space-y-2">
							{formData.team.map((member) => (
								<div
									key={member.email}
									className="flex items-center justify-between p-2 bg-muted rounded-md"
								>
									<span className="text-sm font-medium">{member.email}</span>
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground">
											{roles.find((r) => r.id === member.roleId)?.displayName}
										</span>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											onClick={() => removeTeamMember(member.email)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
					<Button
						processing={isLoading}
						type="button"
						className="w-full"
						disabled={isLoading}
						onClick={handleSubmit}
					>
						{isLoading ? "Creating..." : "Create Workspace"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
