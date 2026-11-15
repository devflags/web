"use client"

import { useParams } from "next/navigation"
import { ProjectEnvironmentRedirect } from "@/components/projects/project-environment-redirect"

export default function LegacyProjectSettingsPage() {
    const { id } = useParams<{ id: string }>()
    return <ProjectEnvironmentRedirect projectId={id} suffix="/settings/project" />
}
