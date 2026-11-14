import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"
import { createEnvironment } from "@/lib/api/environment"
import { environmentsKeys } from "./keys"

export function useCreateEnvironment(projectId: string) {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return useMutation({
        mutationFn: (name: string) => createEnvironment(projectId, name),
        onSuccess: async () => {
            if (!organizationId) return
            await queryClient.invalidateQueries({
                queryKey: environmentsKeys.getEnvironments(organizationId, projectId),
            })
        },
    })
}
