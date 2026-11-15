"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetEnvironments } from "@/hooks/environments/queries"

export function ProjectEnvironmentRedirect({
    projectId,
    suffix = "",
}: {
    projectId: string
    suffix?: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: environments, isLoading, isError } = useGetEnvironments(projectId)
    const requestedEnvironmentId = searchParams.get("environment")

    useEffect(() => {
        if (isLoading || isError || !environments) return

        if (environments.length === 0) {
            router.replace(`/projects/${projectId}/environments/new`)
            return
        }

        const environment = environments.find((item) => item.id === requestedEnvironmentId) ?? environments[0]
        const query = new URLSearchParams(searchParams.toString())
        query.delete("environment")
        const queryString = query.size > 0 ? `?${query.toString()}` : ""
        router.replace(`/projects/${projectId}/environments/${environment.id}${suffix}${queryString}`)
    }, [environments, isError, isLoading, projectId, requestedEnvironmentId, router, searchParams, suffix])

    return (
        <div className="flex min-h-0 flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
                {isError ? "Unable to load project environments." : "Opening project environment…"}
            </p>
        </div>
    )
}
