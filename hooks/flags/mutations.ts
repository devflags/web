import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { flagsKeys } from "./keys";
import {
    createFlag,
    CreateFlagPayload,
    updateFlag,
    UpdateFlagPayload,
    updateFlagEnvironmentConfiguration,
    UpdateFlagEnvironmentPayload,
    createTargetingRule,
    updateTargetingRule,
    deleteTargetingRule,
    TargetingRulePayload,
    BaseFlag,
} from "@/lib/api/flags";

export default function useCreateFlag(projectId: string) {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();
    const organizationId = session?.session.activeOrganizationId;

    return useMutation<BaseFlag, Error, CreateFlagPayload>({
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

export function useUpdateFlag(projectId: string, flagId: string) {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();
    const organizationId = session?.session.activeOrganizationId;

    return useMutation<BaseFlag, Error, UpdateFlagPayload>({
        mutationFn: (payload) => updateFlag(projectId, flagId, payload),
        onSuccess: async () => {
            if (!organizationId) return;

            await queryClient.invalidateQueries({
                queryKey: flagsKeys.getFlags(organizationId, projectId),
            });
            await queryClient.invalidateQueries({
                queryKey: flagsKeys.getFlag(organizationId, projectId, flagId),
            });
        },
    });
}

function useInvalidateFlagEnvironment(projectId: string, flagId: string, environmentId: string) {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()
    const organizationId = session?.session.activeOrganizationId

    return async () => {
        if (!organizationId) return
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: flagsKeys.getFlagEnvironment(organizationId, projectId, flagId, environmentId) }),
            queryClient.invalidateQueries({ queryKey: flagsKeys.getFlags(organizationId, projectId) }),
        ])
    }
}

export function useUpdateFlagEnvironment(projectId: string, flagId: string, environmentId: string) {
    const invalidate = useInvalidateFlagEnvironment(projectId, flagId, environmentId)
    return useMutation({
        mutationFn: (payload: UpdateFlagEnvironmentPayload) =>
            updateFlagEnvironmentConfiguration(projectId, flagId, environmentId, payload),
        onSuccess: invalidate,
    })
}

export function useCreateTargetingRule(projectId: string, flagId: string, environmentId: string) {
    const invalidate = useInvalidateFlagEnvironment(projectId, flagId, environmentId)
    return useMutation({
        mutationFn: (payload: TargetingRulePayload) => createTargetingRule(projectId, flagId, environmentId, payload),
        onSuccess: invalidate,
    })
}

export function useUpdateTargetingRule(projectId: string, flagId: string, environmentId: string, ruleId: string) {
    const invalidate = useInvalidateFlagEnvironment(projectId, flagId, environmentId)
    return useMutation({
        mutationFn: (payload: TargetingRulePayload) => updateTargetingRule(projectId, flagId, environmentId, ruleId, payload),
        onSuccess: invalidate,
    })
}

export function useSaveTargetingRule(projectId: string, flagId: string, environmentId: string) {
    const invalidate = useInvalidateFlagEnvironment(projectId, flagId, environmentId)
    return useMutation({
        mutationFn: ({ ruleId, payload }: { ruleId?: string; payload: TargetingRulePayload }) =>
            ruleId
                ? updateTargetingRule(projectId, flagId, environmentId, ruleId, payload)
                : createTargetingRule(projectId, flagId, environmentId, payload),
        onSuccess: invalidate,
    })
}

export function useDeleteTargetingRule(projectId: string, flagId: string, environmentId: string) {
    const invalidate = useInvalidateFlagEnvironment(projectId, flagId, environmentId)
    return useMutation({
        mutationFn: (ruleId: string) => deleteTargetingRule(projectId, flagId, environmentId, ruleId),
        onSuccess: invalidate,
    })
}
