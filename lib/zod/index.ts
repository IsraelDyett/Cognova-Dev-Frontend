import { z } from "zod";

export * from "./schemas/auth";
export const initializeWorkspaceSchema = z.object({
	displayName: z
		.string()
		.min(1, "Workspace name is required")
		.min(3, "Workspace name must be greater than 3 characters")
		.max(32, "Workspace name can't be greater than 32 characters"),
	team: z.array(
		z.object({
			email: z.string().email("Invalid email address"),
			roleId: z.string().min(1, "Role is required"),
		}),
	),
});
