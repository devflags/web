"use client"

import { useParams } from "next/navigation"
import { ProjectEnvironmentRedirect } from "@/components/projects/project-environment-redirect"

export default function LegacyFlagDetailPage() {
    const { id, flagId } = useParams<{ id: string; flagId: string }>()
    return <ProjectEnvironmentRedirect projectId={id} suffix={`/flags/${flagId}`} />
}
