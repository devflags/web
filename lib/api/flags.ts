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
    enabled: boolean
    defaultValue: boolean | string | number
}

export type Flag = BaseFlag & {
    environments: FlagEnvironment[]
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


export async function getFlags(projectId: string): Promise<Flag[]> {
    return api.get<Flag[]>(`projects/${projectId}/flags`)
}

export async function createFlag(projectId: string, payload: CreateFlagPayload): Promise<Flag> {
    return api.post<Flag>(`projects/${projectId}/flags`, payload)
}