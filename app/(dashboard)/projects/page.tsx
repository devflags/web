"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { FolderInput, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useCreateProject from "@/hooks/projects/mutations"
import { useGetProjects } from "@/hooks/projects/queries"
import { getErrorMessage } from "@/lib/errors"

export default function ProjectsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const createProject = useCreateProject()
    const {
        data: projects,
        isLoading,
        isError,
        error,
    } = useGetProjects()

    function closeCreateModal() {
        if (createProject.isPending) {
            return
        }

        setIsCreateModalOpen(false)
        setName("")
        setDescription("")
        createProject.reset()
    }

    function handleCreateProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const projectName = name.trim()
        if (!projectName) {
            return
        }

        createProject.mutate(
            {
                name: projectName,
                description: description.trim() || undefined,
            },
            {
                onSuccess: closeCreateModal,
            },
        )
    }

    if (isLoading) {
        return <p>A carregar projetos...</p>
    }

    if (isError) {
        const message = getErrorMessage(
            error,
            "Não foi possível carregar os projetos.",
        )

        return <p className="text-destructive">{message}</p>
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-start gap-3">
                    <FolderInput className="mt-1 size-5 text-muted-foreground" />
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Projects
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create and manage your projects
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        createProject.reset()
                        setIsCreateModalOpen(true)
                    }}
                >
                    <Plus />
                    Create Project
                </Button>
            </header>
            {!projects || projects.length === 0 ? (
                <p className="pt-6 text-muted-foreground">No projects found.</p>
            ) : (
                <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                        >
                            <h2 className="font-semibold">{project.name}</h2>
                            {project.slug && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {project.slug}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeCreateModal()
                        }
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-project-title"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h2
                                    id="create-project-title"
                                    className="text-lg font-semibold"
                                >
                                    Add a project
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    The home of something big!
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Close"
                                onClick={closeCreateModal}
                            >
                                <X />
                            </Button>
                        </div>

                        <form
                            className="mt-6 space-y-5"
                            onSubmit={handleCreateProject}
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="project-name"
                                    className="text-sm font-medium"
                                >
                                    Name
                                </label>
                                <Input
                                    id="project-name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Vandelay Industries"
                                    maxLength={100}
                                    required
                                    autoFocus
                                    disabled={createProject.isPending}
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="project-description"
                                    className="text-sm font-medium"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="project-description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Description about your project..."
                                    maxLength={500}
                                    disabled={createProject.isPending}
                                    className="min-h-28 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {createProject.isError && (
                                <p className="text-sm text-destructive">
                                    {getErrorMessage(
                                        createProject.error,
                                        "Não foi possível criar o projeto.",
                                    )}
                                </p>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={closeCreateModal}
                                    disabled={createProject.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        createProject.isPending ||
                                        !name.trim()
                                    }
                                >
                                    {createProject.isPending
                                        ? "Creating..."
                                        : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
