import NextAuth, { type NextAuthConfig } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import { SignUpOrInAction } from './app/auth/actions';

export const config: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user
        },
        signIn: async ({ user }) => {
            if (!user.email || !user.id) {
                return false;
            }
            await SignUpOrInAction({
                email: user.email,
                name: user.name,
                password: user.id,
            });
            return true;
        },
    },
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config)