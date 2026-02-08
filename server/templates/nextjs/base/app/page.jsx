import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="bg-slate-950">
            <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-medium text-slate-200">
                            Production-ready starter
                        </p>
                        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            __PROJECT_NAME__
                        </h1>
                        <p className="mt-4 text-pretty text-base text-slate-300 sm:text-lg">
                            __PROJECT_DESCRIPTION__
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/signin"
                                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                            >
                                Create account
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            After signing in, you’ll land on <span className="font-medium text-slate-200">/dashboard</span>.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
                        <h2 className="text-sm font-semibold text-slate-200">What’s included</h2>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li className="flex gap-2">
                                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                                App Router architecture with route groups
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                                Tailwind CSS configured (no unstyled pages)
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                                NextAuth Credentials + JWT sessions
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                                Health endpoint: <span className="font-medium text-slate-200">/api/health</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
