import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

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
                const user = { id: "1", name: "J Smith", email: "user@example.com", passwordHash: "$2a$10$..." }

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
