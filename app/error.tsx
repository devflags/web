"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
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
        <main className="flex min-h-screen flex-1 items-center justify-center px-5 py-12">
            <section className="w-full max-w-md text-center">
                <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <AlertTriangle className="size-5" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    An unexpected error occurred while loading this page. Try again, or return to the dashboard.
                </p>
                {error.digest && (
                    <p className="mt-3 text-xs text-muted-foreground">Error reference: {error.digest}</p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Button onClick={retry}>
                        <RotateCcw aria-hidden="true" />
                        Try again
                    </Button>
                    <Button nativeButton={false} variant="outline" render={<Link href="/" />}>
                        Back to home
                    </Button>
                </div>
            </section>
        </main>
    )
}
