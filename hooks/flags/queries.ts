import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getFlags, getFlag, getFlagEnvironmentConfiguration, PaginatedFlags, type BaseFlag, type FlagEnvironmentConfiguration } from "@/lib/api/flags";
import { flagsKeys } from "./keys";

export function useGetFlags(projectId: string, environmentId: string | undefined) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<PaginatedFlags>({
        queryKey: flagsKeys.getFlags(organizationId ?? "none", projectId, environmentId ?? "none"),
        queryFn: () => {
            if (!environmentId) throw new Error("An environment is required to load flags.")
            return getFlags(projectId, environmentId)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: Boolean(organizationId) && Boolean(projectId) && Boolean(environmentId),
        throwOnError: false,
    });
}

export function useGetFlagEnvironment(projectId: string, flagId: string, environmentId: string) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<FlagEnvironmentConfiguration>({
        queryKey: flagsKeys.getFlagEnvironment(organizationId ?? "none", projectId, flagId, environmentId),
        queryFn: () => getFlagEnvironmentConfiguration(projectId, flagId, environmentId),
        enabled: Boolean(organizationId && projectId && flagId && environmentId),
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        throwOnError: false,
    })
}

export function useGetFlag(projectId: string, flagId: string) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<BaseFlag>({
        queryKey: flagsKeys.getFlag(organizationId ?? "none", projectId, flagId),
        queryFn: () => getFlag(projectId, flagId),
        enabled: Boolean(organizationId && projectId && flagId),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        throwOnError: false,
    })
}
