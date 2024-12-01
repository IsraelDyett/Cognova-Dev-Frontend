import { z } from "zod";

const botBaseSchema = z.object({
	workspaceId: z.string().cuid("Invalid selected workspace"),
	businessId: z.string().cuid("Invalid selected business").optional().or(z.literal("")),
	name: z.string().min(1, "Bot name is required"),
	description: z.string().optional(),
	language: z.string().optional(),
	systemMessage: z.string().optional(),
	modelId: z.string().cuid("Invalid selected model"),
	waPhoneNumber: z.string().optional(),
});

export const createBotSchema = botBaseSchema;
export const updateBotSchema = botBaseSchema.partial();
