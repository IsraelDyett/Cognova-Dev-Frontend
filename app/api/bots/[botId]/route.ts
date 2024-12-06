import { z } from "zod";
import { debug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import BotServerActions from "@/lib/actions/server/bot";

const ParamsSchema = z.object({
	botId: z.string().cuid(),
});
export async function GET(request: NextRequest, { params }: { params: { botId: string } }) {
	debug("API", "GET", "PRISMA ACTIONS", "app/(guest)/api/bots/[botId]/route.ts");
	try {
		const result = ParamsSchema.safeParse({ botId: params.botId });

		if (!result.success) {
			return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 });
		}
		const { data: bot } = await BotServerActions.retrieveBot({
			botId: params.botId,
		});

		if (!bot) {
			return NextResponse.json({ error: "Bot not found" }, { status: 404 });
		}

		return NextResponse.json(bot);
	} catch (error) {
		console.error("Error fetching bot configuration:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
