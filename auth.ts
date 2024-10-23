import NextAuth, { type NextAuthConfig } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"

// const exampleUser = {
//     id: '696d951a-780b-4842-a592-3d97d94f9f5f',
//     name: 'IRANZI Thierry',
//     email: 'vpnzoe27@gmail.com',
//     image: 'https://lh3.googleusercontent.com/a/ACg8ocKa4auSWOMF1KAGSBewwW9RfSNC16rPTq8EXq6ace94nFLPxVx1=s96-c'
// }
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
            return true;
        },
    },
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config)