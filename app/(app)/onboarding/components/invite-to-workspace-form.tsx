"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { isEmailValid } from "@/lib/utils";
import type { Role } from "@prisma/client";

interface InviteFormProps {
	roles: Role[];
	onAddMember: (email: string, roleId: string) => void;
	setStartedFillingEmail: (startedFillingEmail: boolean) => void;
}

export default function InviteToWorkspaceForm({
	roles,
	onAddMember,
	setStartedFillingEmail,
}: InviteFormProps) {
	const [email, setEmail] = React.useState("");
	const [roleId, setRoleId] = React.useState(roles[0]?.id || "");
	const [error, setError] = React.useState("");

	const handleAddMember = (e: React.MouseEvent | React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (!isEmailValid(email)) {
			setError("Invalid email address");
			return;
		}
		if (email && roleId) {
			onAddMember(email.trim().toLowerCase(), roleId);
			setStartedFillingEmail(false);
			setEmail("");
		}
	};

	return (
		<div className="flex gap-2 w-full">
			<div className="flex flex-col flex-1">
				<Input
					type="email"
					value={email}
					onChange={(e) => {
						setStartedFillingEmail(true);
						setEmail(e.target.value);
						setError("");
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleAddMember(e);
						}
					}}
					className="h-9"
					placeholder="Email address"
				/>

				<p className="text-xs text-muted-foreground pt-1">
					After adding email hit + Button
				</p>
				{error && <p className="text-xs text-destructive pt-1">{error}</p>}
			</div>
			<div className="flex space-x-2">
				<Select value={roleId} onValueChange={setRoleId}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						{roles.map((role) => (
							<SelectItem key={role.id} value={role.id}>
								{role.displayName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button className="h-9" type="button" variant="outline" onClick={handleAddMember}>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
