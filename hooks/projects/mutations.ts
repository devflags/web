import {
    createProject,
    CreateProjectPayload,
    Project,
} from "@/lib/api/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { projectsKeys } from "./keys";

export default function useCreateProject() {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();
    const organizationId = session?.session.activeOrganizationId;

    return useMutation<Project, Error, CreateProjectPayload>({
        mutationFn: createProject,
        onSuccess: async () => {
            if (!organizationId) {
                return;
            }

            await queryClient.invalidateQueries({
                queryKey: projectsKeys.getProjects(organizationId),
            });
        },
    });
}