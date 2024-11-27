import { z } from "zod";

const botBaseSchema = z.object({
	workspaceId:  z.string().cuid("Invalid selected workspace"),
	businessId: z.string().cuid("Invalid selected business").optional().or(z.literal('')),
	name: z.string().min(1, "Bot name is required"),
	description: z.string().optional(),
	language: z.string().optional(),
	systemMessage: z.string().optional(),
	placeholderMessage: z.string().optional(),
	welcomeMessage: z.string().optional(),
	starterQuestions: z.array(z.string()),
	modelId: z.string().cuid("Invalid selected model"),
	waPhoneNumber: z.string().optional(),
});

export const createBotSchema = botBaseSchema;
export const updateBotSchema = botBaseSchema.partial();

export const botConfigurationBaseSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	systemMessage: z.string().optional(),
	placeholderMessage: z.string().optional(),
	welcomeMessage: z.string().optional(),
	starterQuestions: z.array(z.string()).optional(),
	avatarURL: z.string().url().optional().nullable(),
	botChatAvatarURL: z.string().url().optional().nullable(),
	uMessageColor: z
		.string()
		.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
		.optional(),
	aMessageColor: z
		.string()
		.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
		.optional(),
	showSources: z.boolean(),
	sendButtonText: z.string().optional(),
	customCSS: z.string().optional(),
	embedAngle: z.enum(["left", "right"]).optional(),
	embedWidgetSize: z.enum(["small", "medium", "large"]).optional(),
	embedWidgetIconURL: z.string().url().optional().nullable(),
	embedAutoOpen: z.boolean().optional(),
	embedPingMessage: z.string().optional(),
});
export const createBotConfigurationSchema = botConfigurationBaseSchema;
export const updateBotConfigurationSchema = botConfigurationBaseSchema.partial();
