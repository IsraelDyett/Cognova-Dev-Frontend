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
}

export default function InviteToWorkspaceForm({ roles, onAddMember }: InviteFormProps) {
	const [email, setEmail] = React.useState("");
	const [roleId, setRoleId] = React.useState(roles[0]?.id || "");
	const [error, setError] = React.useState("");

	const handleAddMember = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!isEmailValid(email)) {
			setError("Invalid email address");
			return;
		}
		if (email && roleId) {
			onAddMember(email.trim().toLowerCase(), roleId);
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
						setEmail(e.target.value);
						setError("");
					}}
					className="h-9"
					placeholder="Email address"
				/>
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
