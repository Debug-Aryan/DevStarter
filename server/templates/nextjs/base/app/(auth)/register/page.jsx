'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ErrorMessage from '../../../components/common/ErrorMessage'
import Loader from '../../../components/common/Loader'
import { apiFetch } from '../../../lib/api'

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            })

            router.push('/signin')
        } catch (err) {
            setError(err?.message || 'Failed to create account.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-6xl items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
                <h1 className="text-2xl font-semibold text-white">Create account</h1>
                <p className="mt-1 text-sm text-slate-300">Accounts are stored in your database via DATABASE_URL.</p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-200">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            autoComplete="name"
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    {error ? <ErrorMessage message={error} /> : null}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitting ? <Loader label="Creating" /> : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-300">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-medium text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
