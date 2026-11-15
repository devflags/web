"use client"

import { useParams } from "next/navigation"
import { ProjectEnvironmentRedirect } from "@/components/projects/project-environment-redirect"

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>()
    return <ProjectEnvironmentRedirect projectId={id} />
}
