export const projectsKeys = {
    getProjects: (organizationId: string) => ["projects", organizationId] as const,
};