import { getProject, getProjects, Project } from "@/lib/api/projects";
import { useQuery } from "@tanstack/react-query";
import { projectsKeys } from "./keys";
import { authClient } from "@/lib/auth-client";

export function useGetProject(id: string) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<Project>({
        queryKey: projectsKeys.getProject(organizationId ?? "none", id),
        queryFn: () => getProject(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: Boolean(organizationId) && Boolean(id),
        throwOnError: false,
    });
}

export function useGetProjects() {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<Project[]>({
        queryKey: projectsKeys.getProjects(organizationId ?? "none"),
        queryFn: getProjects,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: Boolean(organizationId),
        throwOnError: false,
    });
}