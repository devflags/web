import { z } from "zod"

import { FeatureFlagType } from "@/lib/api/flags"

export const createFlagSchema = z.object({
    key: z
        .string()
        .trim()
        .min(1, "Key is required.")
        .max(100)
        .regex(
            /^[a-z0-9_-]+$/,
            "Use lowercase letters, numbers, hyphens, and underscores.",
        ),
    name: z.string().trim().min(1, "Name is required.").max(100),
    description: z.string().trim().max(500).optional(),
    type: z.enum([
        FeatureFlagType.BOOLEAN,
        FeatureFlagType.STRING,
        FeatureFlagType.NUMBER,
        FeatureFlagType.JSON,
    ]),
})

/**
 * Turns a human readable name into a valid flag key: lowercase, spaces and
 * special characters become hyphens, accents are dropped. "Café ☕ Novo!"
 * becomes "cafe-novo".
 */
export function toFlagKey(value: string): string {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "")
}

export type CreateFlagFormValues = z.infer<typeof createFlagSchema>