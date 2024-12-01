"use server";
import * as z from "zod";
import { prisma } from "@/lib/services/prisma";
import { workspaceSchema } from "@/lib/zod";
import { generateUniqueName } from "@/lib/actions/server/prisma";
import { User, WorkspaceInviteStatus } from "@prisma/client";
import { InviteEmailTemplate } from "@/components/mails/team-invite";
import resendClient, { RESEND_CONFIG } from "@/lib/services/resend";
import { debug } from "@/lib/utils";
import AuthServerActions from "@/lib/actions/server/auth";

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
	debug("SERVER", "sendWorkspaceInvitation", "PRISMA ACTIONS");
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
	debug("SERVER", "createWorkspaceRecord", "PRISMA ACTIONS");
	const workspace = await prisma.workspace.create({
		data: {
			displayName,
			name,
			ownerId,
		},
	});
	await prisma.workspaceUser.create({
		data: {
			workspaceId: workspace.id,
			userId: ownerId,
		},
	});
	return workspace;
}

async function createWorkspaceInvitation(
	members: {
		workspaceId: string;
		status: WorkspaceInviteStatus;
		email: string;
		roleId: string;
	}[],
) {
	debug("SERVER", "createWorkspaceInvitation", "PRISMA ACTIONS");
	return prisma.workspaceInvitation.createMany({
		data: members,
	});
}

export async function createWorkspaceWithTeam(data: WorkspaceFormData) {
	debug("SERVER", "createWorkspaceWithTeam", "PRISMA ACTIONS");
	try {
		const { data: user } = await AuthServerActions.authUser();
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
