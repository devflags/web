"use client"

import { useParams } from "next/navigation"
import { useGetProject } from "@/hooks/projects/queries"
import { getErrorMessage } from "@/lib/errors"

export default function ProjectSettingsPage() {
    const { id } = useParams<{ id: string }>()
    const { data: project, isLoading, isError, error } = useGetProject(id)

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Project settings</h1>
            </header>
            {isLoading ? <p className="text-sm text-muted-foreground">Loading project…</p> : isError ? (
                <p className="text-sm text-destructive">{getErrorMessage(error, "Unable to load this project.")}</p>
            ) : project ? (
                <dl className="grid max-w-2xl gap-4 rounded-lg border bg-card p-5 sm:grid-cols-2">
                    <div><dt className="text-sm text-muted-foreground">Name</dt><dd className="mt-1 font-medium">{project.name}</dd></div>
                    <div><dt className="text-sm text-muted-foreground">Slug</dt><dd className="mt-1 font-mono text-sm">{project.slug ?? "—"}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-sm text-muted-foreground">Project ID</dt><dd className="mt-1 break-all font-mono text-sm">{project.id}</dd></div>
                </dl>
            ) : null}
        </div>
    )
}
