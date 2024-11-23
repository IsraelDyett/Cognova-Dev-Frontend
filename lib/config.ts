export const CONFIG = {
	INVITATION_EMAIL_FROM: "invitations@cognova.io",
};
export const R2_URL = process.env.NEXT_PUBLIC_STORAGE_BASE_URL as string;
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "cognova.io";

export const HOME_DOMAIN = `https://${ROOT_DOMAIN}`;

export const APP_HOSTNAMES = new Set([`app.${ROOT_DOMAIN}`, "app.localhost:3000"]);
export const ADMIN_HOSTNAMES = new Set([`admin.${ROOT_DOMAIN}`, "admin.localhost:3000"]);
