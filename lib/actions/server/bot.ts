import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class BotServerActions extends BaseServerActionActions {
    public static async getModels({ include = {} }: { include?: Prisma.ModelInclude }) {
        return this.executeAction(
            () => this.prisma.model.findMany({ include }),
            "Failed to get models"
        );
    }

    public static async getBots({ workspaceId, include = {}, where = {} }: { workspaceId: string, include?: Prisma.BotInclude, where?: Prisma.BotWhereInput }) {
        return this.executeAction(
            () => this.prisma.bot.findMany({
                where: {
                    ...where,
                    workspace: {
                        OR: [
                            { id: workspaceId },
                            { name: workspaceId },
                        ],
                    },
                },
                include,
            }),
            "Failed to get bots"
        );
    }

    public static async retrieveBot({ botId, include = {} }: { botId: string, include?: Prisma.BotInclude }) {
        return this.executeAction(
            () => this.prisma.bot.findUnique({
                where: { id: botId },
                include,
            }),
            "Failed to retrieve bot"
        );
    }

    public static async createBot({ data, include = { workspace: true } }: { data: Prisma.BotUncheckedCreateInput, include?: Prisma.BotInclude }) {
        return this.executeAction(
            () => this.prisma.bot.create({
                data: {
                    name: data.name,
                    modelId: data.modelId,
                    workspaceId: data.workspaceId,
                },
                include
            }).then((bot) => {
                return {
                    bot: bot,
                    redirect: `/${bot.workspace.name}/bots/${bot.id}`
                }
            }),
            "Failed to create bot"
        )
    }

    public static async updateBot({ botId, data, include = {} }: { botId: string, data: Prisma.BotUncheckedUpdateInput, include?: Prisma.BotInclude }) {
        return this.executeAction(
            () => this.prisma.bot.update({
                where: { id: botId },
                data: {
                    name: data.name,
                    modelId: data.modelId,
                    workspaceId: data.workspaceId,
                },
                include
            }),
            "Failed to update bot"
        )
    }

    public static async deleteBot({ botId }: { botId: string }) {
        // :TODO need to check who is deleting the bot
        return this.executeAction(
            () => this.prisma.bot.delete({
                where: {
                    id: botId
                }
            }),
            "Failed deleting bot"
        )
    }

    public static async getBotSources({ botId, include = {
        source: {
            include: {
                technique: true,
                syncs: true,
            },
        },
    } }: { botId: string, include?: Prisma.BotSourcesInclude }) {
        return this.executeAction(
            () => this.prisma.botSources.findMany({
                where: {
                    botId,
                },
                include
            }),
            "Failed getting bot sources"
        )
    }

    public static async associateSourceWithBot({ sourceId, botId }: { sourceId: string, botId: string }) {
        return this.executeAction(
            () => this.prisma.botSources.create({
                data: {
                    sourceId,
                    botId,
                },
            }),
            "Failed associating sources to bot"
        )
    }

    public static async dissociateSourceFromBot({ sourceId, botId }: { sourceId: string, botId: string }) {
        return this.executeAction(
            () => this.prisma.botSources.deleteMany({
                where: {
                    sourceId,
                    botId,
                },
            }),
            "Failed to dissociate sources from the bot"
        )
    }
    
    public static async updateOrCreateBotConfig({ botId, data }: { botId: string, data: Prisma.BotConfigurationUncheckedCreateInput }) {
        return this.executeAction(
            () => this.prisma.botConfiguration.upsert({
                where: { botId },
                update: {
                    ...data,
                },
                create: {
                    ...data,
                },
            }),
            "Failed to update or create bot configurations"
        )



    }
}
export default BotServerActions;