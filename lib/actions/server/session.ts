"use server";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { init } from "@paralleldrive/cuid2";

export const createCuid = init({
	random: Math.random,
	length: 25,
});

export const getOrCreateSessionId = async () => {
	const cookieStore = cookies();
	const sessionId = cookieStore.get("headless.session.id")?.value;

	if (sessionId) {
		return sessionId;
	}
	const newSessionId = createCuid();
	cookieStore.set("headless.session.id", newSessionId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 30 * 24 * 60 * 60,
	});

	return newSessionId;
};

export const getBrowserMetadata = async () => {
	const headersList = headers();
	const agent = userAgent({ headers: headersList });

	return {
		browser: agent.browser.name,
		os: agent.os.name,
		device: agent.device.type || "desktop",
	};
};
