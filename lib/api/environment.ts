import { api } from "@/lib/api"

export type Environment = {
    id: string
    name: string
    slug: string
}

export async function getEnvironments(projectId: string): Promise<Environment[]> {
    return api.get<Environment[]>(`/projects/${projectId}/environments`)
}