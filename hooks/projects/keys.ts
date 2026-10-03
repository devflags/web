export const projectsKeys = {
    getProject: (organizationId: string, projectId: string) => [organizationId, "projects", projectId] as const,
    getProjects: (organizationId: string) => [organizationId, "projects"] as const,
};