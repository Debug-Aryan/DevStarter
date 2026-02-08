import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { authOptions } from '../../../lib/auth'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect(`/signin?callbackUrl=${encodeURIComponent('/dashboard')}`)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
                    <p className="mt-2 text-slate-300">You are signed in with NextAuth (JWT strategy).</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
                    <h2 className="text-sm font-semibold text-slate-200">Session</h2>
                    <div className="mt-4 grid gap-3 text-sm text-slate-300">
                        <p>
                            <span className="text-slate-400">Email:</span> {session.user.email}
                        </p>
                        <p>
                            <span className="text-slate-400">Name:</span> {session.user.name || '—'}
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                        >
                            Back to home
                        </Link>
                        <Link
                            href="/api/health"
                            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                        >
                            Check health
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
