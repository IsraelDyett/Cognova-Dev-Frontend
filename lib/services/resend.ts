import { Resend } from "resend";
import { CONFIG } from "@/lib/config";

export const RESEND_CONFIG = {
  apiKey: process.env.RESEND_API_KEY,
  fromName: process.env.RESEND_FROM_NAME,
  fromEmail: CONFIG.INVITATION_EMAIL_FROM,
} as const;

const resendClient = new Resend(RESEND_CONFIG.apiKey);
export default resendClient;
