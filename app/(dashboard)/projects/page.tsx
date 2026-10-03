"use client"

import { useState } from "react"
import Link from "next/link"
import { FolderInput, Plus } from "lucide-react"

import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Button } from "@/components/ui/button"
import { useGetProjects } from "@/hooks/projects/queries"
import { getErrorMessage } from "@/lib/errors"

export default function ProjectsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { data: projects, isLoading, isError, error } = useGetProjects()

    if (isLoading) return <p>A carregar projetos...</p>
    if (isError) {
        return <p className="text-destructive">{getErrorMessage(error, "Não foi possível carregar os projetos.")}</p>
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-start gap-3">
                    <FolderInput className="mt-1 size-5 text-muted-foreground" />
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Create and manage your projects</p>
                    </div>
                </div>
                <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus />
                    Create Project
                </Button>
            </header>
            {!projects || projects.length === 0 ? (
                <p className="pt-6 text-muted-foreground">No projects found.</p>
            ) : (
                <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
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
