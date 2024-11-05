import { z } from "zod";

const botBaseSchema = z.object({
    name: z.string(),
    workspaceId: z.string(),
    description: z.string().nullable().optional(),
    language: z.string().nullable().optional(),
    systemMessage: z.string().nullable().optional(),
    placeholderMessage: z.string().nullable().optional(),
    welcomeMessage: z.string().nullable().optional(),
    starterQuestions: z.array(z.string()),
    modelId: z.string(),
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
    uMessageColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    aMessageColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    showSources: z.boolean(),
    sendButtonText: z.string().optional(),
    customCSS: z.string().optional(),
    embedAngle: z.enum(["left", "right"]).optional(),
    embedWidgetSize: z.enum(["small", "medium", "large"]).optional(),
    embedWidgetIconURL: z.string().url().optional().nullable(),
    embedAutoOpen: z.boolean().optional(),
    embedPingMessage: z.string().optional(),
});
export type BotConfig = z.infer<typeof botConfigurationBaseSchema>;
export const createBotConfigurationSchema = botConfigurationBaseSchema;
export const updateBotConfigurationSchema = botConfigurationBaseSchema.partial();


// Base Bot Sources Schema
const botSourcesBaseSchema = z.object({
    botId: z.string(),
    sourceId: z.string(),
});

export const createBotSourcesSchema = botSourcesBaseSchema;
export const updateBotSourcesSchema = botSourcesBaseSchema.partial();
