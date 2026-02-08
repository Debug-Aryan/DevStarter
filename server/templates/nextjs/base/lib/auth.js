import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Pool } from 'pg'

function getDbPool() {
    if (!process.env.DATABASE_URL) {
        const err = new Error('DATABASE_URL is not set. Create a database and configure DATABASE_URL in your environment.')
        err.statusCode = 500
        throw err
    }

    globalThis.__devstarterPgPool = globalThis.__devstarterPgPool || new Pool({ connectionString: process.env.DATABASE_URL })
    return globalThis.__devstarterPgPool
}

async function findUserByEmail(email) {
    const pool = getDbPool()
    const result = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1',
        [String(email).toLowerCase()]
    )
    return result.rows[0] || null
}

export async function createUser({ name, email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const plainPassword = String(password || '')
    const displayName = String(name || '').trim()

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
        const err = new Error('A valid email is required.')
        err.statusCode = 400
        throw err
    }

    if (plainPassword.length < 8) {
        const err = new Error('Password must be at least 8 characters.')
        err.statusCode = 400
        throw err
    }

    const existing = await findUserByEmail(normalizedEmail)
    if (existing) {
        const err = new Error('An account with this email already exists.')
        err.statusCode = 409
        throw err
    }

    const passwordHash = await bcrypt.hash(plainPassword, 12)
    const pool = getDbPool()

    const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [displayName || null, normalizedEmail, passwordHash]
    )

    return result.rows[0]
}

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const email = String(credentials?.email || '').trim().toLowerCase()
                const password = String(credentials?.password || '')

                if (!email || !password) return null

                const user = await findUserByEmail(email)
                if (!user?.password_hash) return null

                const isValid = await bcrypt.compare(password, user.password_hash)
                if (!isValid) return null

                return {
                    id: String(user.id),
                    name: user.name || user.email,
                    email: user.email,
                }
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) token.id = user.id
            return token
        },
        async session({ session, token }) {
            if (session?.user && token?.id) {
                session.user.id = token.id
            }
            return session
        },
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
}
