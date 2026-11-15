"use client"

import { useParams } from "next/navigation"

export default function ProjectEnvironmentOverviewPage() {
    const { id, environmentId } = useParams<{ id: string; environmentId: string }>()

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            </header>
            <section className="rounded-lg border bg-card p-4 text-card-foreground">
                <p className="text-sm text-muted-foreground">Environment ID</p>
                <p className="mt-1 break-all font-mono text-sm">{environmentId}</p>
                <p className="mt-4 text-sm text-muted-foreground">Project ID</p>
                <p className="mt-1 break-all font-mono text-sm">{id}</p>
            </section>
        </div>
    )
}
