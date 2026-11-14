export const flagsKeys = {
    getFlags: (organizationId: string, projectId: string, environmentId?: string) => environmentId
        ? [organizationId, "projects", projectId, "flags", environmentId] as const
        : [organizationId, "projects", projectId, "flags"] as const,
    getFlag: (organizationId: string, projectId: string, flagId: string) =>
        [organizationId, "projects", projectId, "flags", flagId] as const,
    getFlagEnvironment: (organizationId: string, projectId: string, flagId: string, environmentId: string) =>
        [organizationId, "projects", projectId, "flags", flagId, "environments", environmentId] as const,
};
