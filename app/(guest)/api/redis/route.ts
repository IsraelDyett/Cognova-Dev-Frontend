import { redis } from "@/lib/services/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { key, value, exp } = await request.json();
	await redis.set(key, value, { EX: exp || 60 * 60 * 24 });

	return NextResponse.json({ message: "Key saved successfully" }, { status: 200 });
}

export async function GET(request: NextRequest) {
	const key = request.nextUrl.searchParams.get("key");

	if (!key) {
		return NextResponse.json({ error: "Key is required" }, { status: 400 });
	}

	const value = await redis.get(key);
	return NextResponse.json({ key, value }, { status: 200 });
}
