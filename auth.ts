import { SignUpOrInAction } from './app/auth/actions';
import GoogleProvider from "next-auth/providers/google"
import NextAuth, { type NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers';

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
            return !!auth?.user
        },
        signIn: async ({ user }) => {
            if (!user.email || !user.id) {
                return false;
            }
            const response = await SignUpOrInAction({
                email: user.email,
                name: user.name,
                password: user.id,
            }, "google");
            if ('data' in response) {
                cookies().set("auth.session.token", response.data.sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    sameSite: 'lax',
                    expires: response.data.expiresAt,
                })
            }
            return true;
        },
    },
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config)