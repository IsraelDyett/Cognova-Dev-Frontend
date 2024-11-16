import { z } from "zod";

export const workspaceSchema = z.object({
    displayName: z.string().min(1, "Workspace name is required"),
    planId: z.string().cuid("Invalid plan id").optional(),
});

export const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    roleId: z.string().cuid("Invalid role id"),
});
export const invitesSchema = z.array(inviteSchema);