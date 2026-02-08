import './globals.css'

import Navbar from '../components/layout/Navbar'
import Providers from './providers'

export const metadata = {
    title: '__PROJECT_NAME__',
    description: '__PROJECT_DESCRIPTION__',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex min-h-dvh flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <footer className="border-t border-slate-800 bg-slate-950/60">
                            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 text-sm text-slate-300">
                                <p className="truncate">© {new Date().getFullYear()} __PROJECT_NAME__</p>
                                <p className="hidden sm:block">Built with Next.js + Tailwind + NextAuth</p>
                            </div>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
