import { z } from "zod";

export const SignUpSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be a maximun 32 characters"),
	name: z.string().min(2).nullable().optional(),
	image: z.string().nullable().optional(),
	uplineId: z.string().cuid2().nullable().optional(),
});

export const SignInSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be a maximun 32 characters"),
});
