import { setSessionTokenCookie, SignUpOrInAction } from "./app/(guest)/auth/actions";
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { type NextAuthConfig } from "next-auth";

// Define the expected response type
interface AuthResponse {
	data?: {
		sessionToken: string;
		expiresAt: Date;
	};
	error?: string;
}

export const config: NextAuthConfig = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		authorized({ auth }) {
			return !!auth?.user;
		},
		signIn: async ({ user }) => {
			if (!user.email || !user.id) {
				return false;
			}

			try {
				const response = (await SignUpOrInAction(
					{
						email: user.email,
						name: user.name,
						password: user.id,
						image: user.image,
					},
					"google",
				)) as AuthResponse;

				if (response?.data?.sessionToken && response?.data?.expiresAt) {
					setSessionTokenCookie(response?.data?.sessionToken);
					return true;
				}

				console.error("Invalid response data from SignUpOrInAction");
				return false;
			} catch (error) {
				console.error("Error during sign in:", error);
				return false;
			}
		},
	},
};

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NextAuth(config);
