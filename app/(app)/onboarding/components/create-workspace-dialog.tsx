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
import InviteToWorkspaceForm from "./invite-to-workspace-form";
import { Role } from "@prisma/client";
import { getRoles } from "@/lib/actions/server/auth";
import posthog from "posthog-js";
import { initializeWorkspace } from "@/lib/actions/server/workspace";
import { Label } from "@/components/ui/label";

interface FormData {
	displayName: string;
	team: Array<{ email: string; roleId: string }>;
}

export default function CreateWorkspaceDialog({
	customTrigger,
}: {
	customTrigger?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [formData, setFormData] = React.useState<FormData>({
		displayName: "",
		team: [],
	});
	const [error, setError] = React.useState("");

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setFormData({ displayName: "", team: [] });
			setError("");
		}
		setIsOpen(open);
	};

	const addTeamMember = (email: string, roleId: string) => {
		setFormData((prev) => ({
			...prev,
			team: [...prev.team, { email, roleId }],
		}));
	};

	const removeTeamMember = (email: string) => {
		setFormData((prev) => ({
			...prev,
			team: prev.team.filter((member) => member.email !== email),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.displayName.trim()) {
			setError("Workspace name is required");
			return;
		}
		try {
			setIsLoading(true);
			const {
				data: result,
				success,
				error,
			} = await initializeWorkspace({
				data: {
					displayName: formData.displayName.trim(),
					team: formData.team,
				},
			});

			if (success) {
				handleOpenChange(false);
				posthog.capture("Workspace Created", { workspaceId: result.displayName });
				toast.success("Workspace created successfully");
				window.location.assign(`/${result.name}`);
			}
			setError(error || "Failed to create workspace");
		} catch (error) {
			console.error("Error creating workspace:", error);
			setError("Failed to create workspace");
		} finally {
			setIsLoading(false);
		}
	};
	React.useEffect(() => {
		const loadRoles = async () => {
			debug("CLIENT", "loadRoles", "PAGE");
			const { data: roles } = await getRoles();
			setRoles(roles);
		};
		if (roles.length === 0) {
			loadRoles();
		}
	}, [roles.length, setRoles]);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{customTrigger ? (
					customTrigger
				) : (
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
						<Label>Workspace Name</Label>
						<Input
							placeholder="Enter workspace name"
							value={formData.displayName}
							onChange={(e) => {
								setFormData((prev) => ({
									...prev,
									displayName: e.target.value,
								}));
								setError("");
							}}
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>

					<div className="space-y-4">
						<Label helpText="Team members are people who can make changes to your workspace">
							Team Members (Optional)
						</Label>
						<InviteToWorkspaceForm roles={roles} onAddMember={addTeamMember} />
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
