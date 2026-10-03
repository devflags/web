export const flagsKeys = {
    getFlags: (organizationId: string, projectId: string) => [organizationId, "projects", projectId, "flags"] as const,
};