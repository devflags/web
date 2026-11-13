import { z } from "zod"

import { FeatureFlagType } from "@/lib/api/flags"

export const createFlagSchema = z.object({
    name: z
        .string()
        .min(5, "Name must be at least 5 characters.")
        .max(32, "Name must be at most 32 characters."),
    key: z
        .string()
        .trim()
        .min(1, "Key is required.")
        .max(100)
        .regex(
            /^[a-z0-9_-]+$/,
            "Use lowercase letters, numbers, hyphens, and underscores.",
        ),
    description: z
        .string()
        .max(500, "Description must be at most 500 characters.")
        .optional(),
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