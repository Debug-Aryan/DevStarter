import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a mock example. In production replace with real DB lookup

                // Mock check
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "J Smith", email: "user@example.com" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
