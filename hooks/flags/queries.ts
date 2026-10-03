import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Flag, getFlags } from "@/lib/api/flags";
import { flagsKeys } from "./keys";

export function useGetFlags(projectId: string) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<Flag[]>({
        queryKey: flagsKeys.getFlags(organizationId ?? "none", projectId),
        queryFn: () => getFlags(projectId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: Boolean(organizationId) && Boolean(projectId),
        throwOnError: false,
    });
}