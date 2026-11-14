"use client"

import { useState } from "react"
import Link from "next/link"
import { FolderKanban, Plus, Users } from "lucide-react"

import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Button } from "@/components/ui/button"
import { useGetProjects } from "@/hooks/projects/queries"
import { getErrorMessage } from "@/lib/errors"
import { EmptyState } from "@/components/dashboard/empty-state"

export default function ProjectsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { data: projects, isLoading, isError, error } = useGetProjects()

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus />
                    Create Project
                </Button>
            </header>
            {isLoading ? (
                <p className="text-muted-foreground">Loading projects…</p>
            ) : isError ? (
                <p className="text-destructive">{getErrorMessage(error, "Unable to load projects.")}</p>
            ) : !projects || projects.length === 0 ? (
                <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to get started." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                            <h2 className="font-semibold">{project.name}</h2>
                            {project.slug && <p className="mt-1 text-sm text-muted-foreground">{project.slug}</p>}
                        </Link>
                    ))}
                </div>
            )}
            <CreateProjectDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
        </div>
    )
}
