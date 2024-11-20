import { z } from "zod";

export const workspaceSchema = z.object({
  displayName: z.string().min(1, "Workspace name is required"),
});

export const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  roleId: z.string().cuid2("Invalid role id"),
});
export const invitesSchema = z.array(inviteSchema);
