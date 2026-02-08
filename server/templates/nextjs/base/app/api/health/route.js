import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Server healthy',
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
        },
    })
}
