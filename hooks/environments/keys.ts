export const environmentsKeys = {
    getEnvironments: (organizationId: string, projectId: string) =>
        [organizationId, "projects", projectId, "environments"] as const,
}
