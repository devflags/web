"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw } from "lucide-react"

import "./globals.css"

export default function GlobalErrorPage({
    error,
    retry,
}: {
    error: Error & { digest?: string }
    retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans text-foreground antialiased">
                <main className="flex min-h-screen items-center justify-center px-5 py-12">
                    <section className="w-full max-w-md text-center">
                        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <AlertTriangle className="size-5" aria-hidden="true" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            DevFlags could not load. Try again, or return to the dashboard.
                        </p>
                        {error.digest && (
                            <p className="mt-3 text-xs text-muted-foreground">Error reference: {error.digest}</p>
                        )}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={retry}
                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                <RotateCcw className="size-4" aria-hidden="true" />
                                Try again
                            </button>
                            <Link
                                href="/"
                                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                Back to home
                            </Link>
                        </div>
                    </section>
                </main>
            </body>
        </html>
    )
}
