import { ApiError } from "@/lib/api"

export function getErrorMessage(
    error: unknown,
    fallback = "Something went wrong.",
): string {
    if (error instanceof ApiError) {
        return error.payload?.message ?? error.message ?? fallback
    }

    if (error instanceof Error) {
        return error.message || fallback
    }

    return fallback
}
