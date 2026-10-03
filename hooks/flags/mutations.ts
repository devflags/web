import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { flagsKeys } from "./keys";
import { createFlag, CreateFlagPayload } from "@/lib/api/flags";
import { Flag } from "@/lib/api/flags";

export default function useCreateFlag(projectId: string) {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();
    const organizationId = session?.session.activeOrganizationId;

    return useMutation<Flag, Error, CreateFlagPayload>({
        mutationFn: (payload: CreateFlagPayload) => createFlag(projectId, payload),
        onSuccess: async () => {
            if (!organizationId) {
                return;
            }

            await queryClient.invalidateQueries({
                queryKey: flagsKeys.getFlags(organizationId, projectId),
            });
        },
    });
}