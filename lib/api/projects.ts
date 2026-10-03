import { api } from "@/lib/api"

export type Project = {
    id: string
    name: string
    slug?: string
}

export type CreateProjectPayload = {
    name: string
    description?: string
}

export async function getProjects(): Promise<Project[]> {
    return api.get<Project[]>("/projects")
}

export async function getProject(id: string): Promise<Project> {
    return api.get<Project>(`/projects/${id}`)
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
    return api.post<Project>("/projects", payload)
}