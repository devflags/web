import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { getEnvironments, type Environment } from "@/lib/api/environment"
import { environmentsKeys } from "./keys"

export function useGetEnvironments(projectId: string | undefined) {
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useQuery<Environment[]>({
        queryKey: environmentsKeys.getEnvironments(
            organizationId ?? "none",
            projectId ?? "none",
        ),
        queryFn: () => {
            if (!projectId) {
                throw new Error("A project is required to load environments.")
            }

            return getEnvironments(projectId)
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: Boolean(organizationId) && Boolean(projectId),
        throwOnError: false,
    })
}
