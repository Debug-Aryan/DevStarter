import { NextResponse } from 'next/server'

import { createUser } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req) {
    try {
        const body = await req.json()
        const { name, email, password } = body || {}

        const user = await createUser({ name, email, password })

        return NextResponse.json({
            success: true,
            message: 'Account created',
            data: { id: user.id, email: user.email, name: user.name },
        })
    } catch (err) {
        const message = err?.message || 'Unable to create account'
        const status = err?.statusCode || 400
        return NextResponse.json({ success: false, message }, { status })
    }
}
