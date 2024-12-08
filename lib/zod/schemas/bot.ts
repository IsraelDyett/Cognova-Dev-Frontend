import { z } from "zod";

const botBaseSchema = z.object({
	workspaceId: z.string().cuid("Invalid selected workspace"),
	businessId: z.string().cuid("Invalid selected business").optional().or(z.literal("")),
	name: z.string().min(1, "Bot name is required"),
	description: z.string().optional(),
	language: z.string().optional(),
	systemMessage: z.string().optional(),
	modelId: z.string().cuid("Invalid selected model"),
	// waPhoneNumber: z
	// 	.string()
	// 	.refine(async (value) => {
	// 		if (!value) return true;
	// 		const cleaned = value.replace(/[^\d]/g, "");

	// 		try {
	// 			const parsePhoneNumber = await import("libphonenumber-js");
	// 			const phoneNumber = parsePhoneNumber.isValidPhoneNumber(
	// 				"+" + cleaned.replaceAll("+", "").trim(),
	// 			);
	// 			return !!phoneNumber;
	// 		} catch (error) {
	// 			return false;
	// 		}
	// 	}, "Please enter a valid phone number in international format without + prefix (e.g. 18005551234 for United States)")
	// 	.optional(),
});

export const createBotSchema = botBaseSchema;
export const updateBotSchema = botBaseSchema.partial();
