import { api } from "@/lib/api"

export const FeatureFlagType = {
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    JSON: 'JSON'
} as const

export type FeatureFlagType = (typeof FeatureFlagType)[keyof typeof FeatureFlagType]


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


export async function getFlags(projectId: string): Promise<PaginatedFlags> {
    return api.get<PaginatedFlags>(`projects/${projectId}/flags`)
}

export async function createFlag(projectId: string, payload: CreateFlagPayload): Promise<Flag> {
    return api.post<Flag>(`projects/${projectId}/flags`, payload)
}

export async function updateFlag(
    projectId: string,
    flagId: string,
    payload: UpdateFlagPayload,
): Promise<Flag> {
    return api.patch<Flag>(`projects/${projectId}/flags/${flagId}`, payload)
}