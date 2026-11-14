import { api } from "@/lib/api"

export const FeatureFlagType = {
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    JSON: 'JSON'
} as const

export type FeatureFlagType = (typeof FeatureFlagType)[keyof typeof FeatureFlagType]

export const RuleOperator = {
    EQUALS: "EQUALS",
    NOT_EQUALS: "NOT_EQUALS",
    CONTAINS: "CONTAINS",
    NOT_CONTAINS: "NOT_CONTAINS",
    STARTS_WITH: "STARTS_WITH",
    ENDS_WITH: "ENDS_WITH",
    IN: "IN",
    NOT_IN: "NOT_IN",
    GREATER_THAN: "GREATER_THAN",
    LESS_THAN: "LESS_THAN",
    GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
} as const

export type RuleOperator = (typeof RuleOperator)[keyof typeof RuleOperator]

export type RuleCondition = {
    id: string
    attribute: string
    operator: RuleOperator
    value: unknown
}

export type TargetingRule = {
    id: string
    priority: number
    percentage: number | null
    value: unknown
    conditions: RuleCondition[]
}

export type FlagEnvironmentConfiguration = {
    id: string
    flagId: string
    environmentId: string
    enabled: boolean
    defaultValue: unknown
    rules: TargetingRule[]
}

export type RuleConditionPayload = Omit<RuleCondition, "id">

export type TargetingRulePayload = {
    priority: number
    percentage: number | null
    value: unknown
    conditions: RuleConditionPayload[]
}

export type UpdateFlagEnvironmentPayload = {
    enabled: boolean
    defaultValue: unknown
}


export type BaseFlag = {
    id: string
    key: string
    name: string
    type: FeatureFlagType
    description?: string
}

export type FlagEnvironment = {
    id: string
    name: string
    enabled: boolean
    defaultValue: boolean | string | number | JSON | null
}


export type Flag = BaseFlag & {
    environments: FlagEnvironment[]
}

export type PaginatedFlags = {
    data: Flag[]
    pagination: {
        nextCursor: string | null
        hasMore: boolean
    }
}

export type CreateFlagPayload = {
    key: string
    name: string
    description?: string
    type: FeatureFlagType
    environments?: {
        id: string
        enabled: boolean
        defaultValue: boolean | string | number
    }[]
}

export type UpdateFlagPayload = Omit<CreateFlagPayload, "environments">


export async function getFlags(projectId: string, environmentId: string): Promise<PaginatedFlags> {
    return api.get<PaginatedFlags>(`projects/${projectId}/flags?environmentId=${encodeURIComponent(environmentId)}`)
}

export async function getFlag(projectId: string, flagId: string): Promise<BaseFlag> {
    return api.get<BaseFlag>(`projects/${projectId}/flags/${flagId}`)
}

export async function createFlag(projectId: string, payload: CreateFlagPayload): Promise<BaseFlag> {
    return api.post<BaseFlag>(`projects/${projectId}/flags`, payload)
}

export async function updateFlag(
    projectId: string,
    flagId: string,
    payload: UpdateFlagPayload,
): Promise<BaseFlag> {
    return api.patch<BaseFlag>(`projects/${projectId}/flags/${flagId}`, payload)
}

export async function getFlagEnvironmentConfiguration(
    projectId: string,
    flagId: string,
    environmentId: string,
): Promise<FlagEnvironmentConfiguration> {
    return api.get<FlagEnvironmentConfiguration>(
        `projects/${projectId}/flags/${flagId}/environments/${environmentId}`,
    )
}

export async function updateFlagEnvironmentConfiguration(
    projectId: string,
    flagId: string,
    environmentId: string,
    payload: UpdateFlagEnvironmentPayload,
): Promise<Omit<FlagEnvironmentConfiguration, "rules">> {
    return api.patch<Omit<FlagEnvironmentConfiguration, "rules">>(
        `projects/${projectId}/flags/${flagId}/environments/${environmentId}`,
        payload,
    )
}

export async function createTargetingRule(
    projectId: string,
    flagId: string,
    environmentId: string,
    payload: TargetingRulePayload,
): Promise<TargetingRule> {
    return api.post<TargetingRule>(
        `projects/${projectId}/flags/${flagId}/environments/${environmentId}/rules`,
        payload,
    )
}

export async function updateTargetingRule(
    projectId: string,
    flagId: string,
    environmentId: string,
    ruleId: string,
    payload: TargetingRulePayload,
): Promise<TargetingRule> {
    return api.patch<TargetingRule>(
        `projects/${projectId}/flags/${flagId}/environments/${environmentId}/rules/${ruleId}`,
        payload,
    )
}

export async function deleteTargetingRule(
    projectId: string,
    flagId: string,
    environmentId: string,
    ruleId: string,
): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(
        `projects/${projectId}/flags/${flagId}/environments/${environmentId}/rules/${ruleId}`,
    )
}
