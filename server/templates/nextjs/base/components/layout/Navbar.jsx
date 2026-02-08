'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar() {
    const { status } = useSession()
    const isAuthed = status === 'authenticated'

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-semibold text-white">
                        __PROJECT_NAME__
                    </Link>
                    <nav className="hidden items-center gap-3 text-sm text-slate-300 sm:flex">
                        <Link href="/dashboard" className="hover:text-white">
                            Dashboard
                        </Link>
                        <Link href="/api/health" className="hover:text-white">
                            Health
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {isAuthed ? (
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900"
                        >
                            Sign out
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="hidden rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 sm:inline-flex"
                            >
                                Register
                            </Link>
                            <button
                                onClick={() => signIn()}
                                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
