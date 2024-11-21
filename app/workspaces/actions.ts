"use server";
import * as z from "zod";
import { authUser } from "../auth/actions";
import { prisma } from "@/lib/services/prisma";
import { workspaceSchema } from "@/lib/zod";
import { generateUniqueName } from "@/utils/transactions";
import { User, WorkspaceInviteStatus } from "@prisma/client";
import { InviteEmailTemplate } from "@/components/mails/team-invite";
import resendClient, { RESEND_CONFIG } from "@/lib/services/resend";

export type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const WORKSPACE_CONFIG = {
  defaultOwnerId: "cm3fqf7or000608jo8n8i9clr",
} as const;

async function sendWorkspaceInvitation(
  emails: string[],
  workspaceId: string,
  displayName: string,
  inviter: User,
) {
  const teamMembersEmails = emails.map((email) => {
    return {
      from: `${RESEND_CONFIG.fromName} <${RESEND_CONFIG.fromEmail}>`,
      to: email,
      subject: `Invitation to join ${displayName}`,
      react: InviteEmailTemplate({
        inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/invitations/${workspaceId}`,
        workspace: displayName,
        inviter: inviter,
      }),
    };
  });
  return resendClient.batch.send(teamMembersEmails);
}

async function createWorkspaceRecord(displayName: string, name: string, ownerId: string) {
  return prisma.workspace.create({
    data: {
      displayName,
      name,
      ownerId,
    },
  });
}

async function createWorkspaceInvitation(
  members: { workspaceId: string; status: WorkspaceInviteStatus; email: string; roleId: string }[],
) {
  return prisma.workspaceInvitation.createMany({
    data: members,
  });
}

export async function createWorkspaceWithTeam(data: WorkspaceFormData) {
  try {
    const user = await authUser().catch(() => null);
    const ownerId = user?.id || WORKSPACE_CONFIG.defaultOwnerId;

    const parsed = workspaceSchema.parse(data);
    const uniqueName = await generateUniqueName(parsed.displayName, "workspace");

    const workspace = await createWorkspaceRecord(parsed.displayName, uniqueName, ownerId);

    if (parsed.team.length > 0) {
      await createWorkspaceInvitation(
        parsed.team.map((member) => {
          return {
            email: member.email,
            roleId: member.roleId,
            workspaceId: workspace.id,
            status: WorkspaceInviteStatus.PENDING,
          };
        }),
      );

      const teamMembersEmails = parsed.team.map((member) => member.email);
      await sendWorkspaceInvitation(
        teamMembersEmails,
        workspace.id,
        parsed.displayName,
        user as User,
      );
    }

    return { success: true, workspaceId: workspace.name };
  } catch (error) {
    console.error("Workspace creation failed:", error);
    return { success: false, error: "Failed to create workspace" };
  }
}
