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


const botConfigurationBaseSchema = z.object({
    botId: z.string(),
    avatarURL: z.string().nullable().optional(),
    uAvatarURL: z.string().nullable().optional(),
    aAvatarURL: z.string().nullable().optional(),
    uMessageColor: z.string().nullable().optional(),
    aMessageColor: z.string().nullable().optional(),
    fontId: z.string(),
    showSources: z.boolean(),
    sendButtonText: z.string().nullable().optional(),
    customCSS: z.string().nullable().optional(),
    embedAngle: z.string().nullable().optional(),
    embedWidgetSize: z.string().nullable().optional(),
    embedWidgetIconURL: z.string().nullable().optional(),
    embedAutoOpen: z.boolean().nullable().optional(),
    embedPingMessage: z.string().nullable().optional(),
});

export const createBotConfigurationSchema = botConfigurationBaseSchema;
export const updateBotConfigurationSchema = botConfigurationBaseSchema.partial();


// Base Bot Sources Schema
const botSourcesBaseSchema = z.object({
    botId: z.string(),
    sourceId: z.string(),
});

export const createBotSourcesSchema = botSourcesBaseSchema;
export const updateBotSourcesSchema = botSourcesBaseSchema.partial();
