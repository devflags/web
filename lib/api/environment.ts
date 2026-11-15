import { api } from "@/lib/api"

export type Environment = {
    id: string
    name: string
    slug: string
    createdAt?: string
}

export async function getEnvironments(projectId: string): Promise<Environment[]> {
    return api.get<Environment[]>(`/projects/${projectId}/environments`)
}

export async function createEnvironment(projectId: string, name: string): Promise<Environment> {
    return api.post<Environment>(`/projects/${projectId}/environments`, { name })
}
