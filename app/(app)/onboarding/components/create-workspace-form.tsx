"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { debug } from "@/lib/utils";
import InviteToWorkspaceForm from "./invite-to-workspace-form";
import { Role } from "@prisma/client";
import { getRoles } from "@/lib/actions/server/auth";
import posthog from "posthog-js";
import { initializeWorkspace } from "@/lib/actions/server/workspace";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { initializeWorkspaceSchema as workspaceSchema } from "@/lib/zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FormData = z.infer<typeof workspaceSchema>;

export default function CreateWorkspaceForm({ onComplete }: { onComplete?: (data?: any) => void }) {
	const [startedFillingEmail, setStartedFillingEmail] = useState(false);
	const [isOpen, setIsOpen] = React.useState(false);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [formData, setFormData] = React.useState<FormData>({
		displayName: "",
		team: [],
	});
	const [error, setError] = React.useState("");
	const [showEmailAlert, setShowEmailAlert] = useState(false);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setFormData({ displayName: "", team: [] });
			setError("");
		}
		setIsOpen(open);
	};

	const addTeamMember = (email: string, roleId: string) => {
		try {
			// Validate single team member before adding
			const memberSchema = workspaceSchema.shape.team.element;
			memberSchema.parse({ email, roleId });

			setFormData((prev) => ({
				...prev,
				team: [...prev.team, { email, roleId }],
			}));
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.errors[0].message);
			}
		}
	};

	const removeTeamMember = (email: string) => {
		setFormData((prev) => ({
			...prev,
			team: prev.team.filter((member) => member.email !== email),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (startedFillingEmail) {
			setShowEmailAlert(true);
			return;
		}

		try {
			// Validate the form data
			const validatedData = workspaceSchema.parse(formData);

			setIsLoading(true);
			const { data: result, success } = await initializeWorkspace({
				data: {
					displayName: validatedData.displayName.trim(),
					team: validatedData.team,
				},
			});

			if (success && onComplete) {
				onComplete(result);
				toast.success("Workspace created successfully");
			} else if (success) {
				handleOpenChange(false);
				posthog.capture("Workspace Created", { workspaceId: result.displayName });
				toast.success("Workspace created successfully");
				window.location.assign(`/${result.name}`);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				// Handle validation errors
				const errors = error.errors;
				if (errors.length > 0) {
					// Set the first error message
					setError(errors[0].message);
				}
			} else {
				console.error("Error creating workspace:", error);
				setError("Failed to create workspace");
			}
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
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-xl font-semibold">Create your workspace</h2>
				<p className="text-gray-500">Set up your businesses workspace to get started</p>
			</div>

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
					<InviteToWorkspaceForm
						roles={roles}
						onAddMember={addTeamMember}
						setStartedFillingEmail={setStartedFillingEmail}
					/>
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
			<AlertDialog open={showEmailAlert} onOpenChange={setShowEmailAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Add Team Member</AlertDialogTitle>
						<AlertDialogDescription>
							You started filling in an email address but haven`&apos;t added it to
							the team list. Please click the + button to add the team member before
							creating the workspace.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setStartedFillingEmail(false);
							}}
						>
							Leave it
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => setShowEmailAlert(false)}>
							Got it
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
