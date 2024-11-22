import { z } from "zod";

export const workspaceSchema = z.object({
	displayName: z.string().min(1, "Workspace name is required"),
	team: z.array(
		z.object({
			email: z.string().email("Invalid email address"),
			roleId: z.string().min(1, "Role is required"),
		}),
	),
});
