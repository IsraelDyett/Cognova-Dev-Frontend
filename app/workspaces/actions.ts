"use server";

import slugify from 'slugify';
import { Resend } from 'resend';
import { prisma } from "@/lib/services/prisma";
import { invitesSchema, workspaceSchema } from '@/lib/zod/schemas/workspace';
import { authUser } from '../auth/actions';
import { InviteEmailTemplate } from '@/fastapi/mails/team-invite';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createWorkspace(
  displayName: string,
  planId?: string,
) {
  try {
    const user = await authUser().catch((er) => { })
    // if(!user) return {
    //   success: false,
    //   error: "USER_NOT_FOUND"
    // };
    const parsed = workspaceSchema.parse({ displayName, planId });

    const workspace = await prisma.workspace.create({
      data: {
        displayName: parsed.displayName,
        name: slugify(parsed.displayName, { lower: true, trim: true }),
        planId: parsed.planId,
        ownerId: user?.id || "cm3fqf7or000608jo8n8i9clr",
      },
    });

    return { success: true, workspaceId: workspace.id };
  } catch (error) {
    console.error('Workspace creation failed:', error);
    return { success: false, error: "Failed to create workspace" };
  }
}

export async function inviteTeammates(
  workspaceId: string,
  invites: Array<{ email: string; roleId: string }>,
) {
  try {
    const parsed = invitesSchema.parse(invites);

    const invitePromises = parsed.map(async (invite) => {
      // const invitation = await prisma.workspaceInvitation.create({
      //   data: {
      //     workspace: { connect: { id: workspaceId } },
      //     email: invite.email,
      //     role: { connect: { id: invite.roleId } },
      //     status: 'PENDING',
      //   },
      //   include: {
      //     workspace: {
      //       select: { displayName: true }
      //     }
      //   }
      // });

      const s = await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
        to: invite.email,
        subject: `Invitation to join SS`,
        react: InviteEmailTemplate({ link: `${process.env.NEXT_PUBLIC_APP_URL}/invite/accept/ss` })
      });
      console.log("S", s)
      return invite.email;
    });

    const invitedEmails = await Promise.all(invitePromises);
    return { success: true, invitedEmails };
  } catch (error) {
    console.error('Failed to send invites:', error);
    return { success: false, error: "Failed to send invites" };
  }
}
