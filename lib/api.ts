const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "")

export type ApiMeta = {
    requestId: string
    timestamp: string
    path?: string
}

export type ApiErrorPayload = {
    statusCode: number
    code: string
    message: string
    details?: unknown
}

export type ApiSuccess<T> = {
    data: T
    meta: ApiMeta
}

export type ApiFailure = {
    error: ApiErrorPayload
    meta: ApiMeta
}

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly response: Response,
        public readonly payload?: ApiErrorPayload,
        public readonly meta?: ApiMeta,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

class ApiClient {
    private static instance: ApiClient

    private constructor() {}

    static getInstance() {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient()
        }

        return ApiClient.instance
    }

    async request<T>(
        path: string,
        options: RequestInit = {},
    ): Promise<T> {
        const headers = new Headers(options.headers)

        if (options.body !== undefined && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json")
        }

        const response = await fetch(`${API_URL}/${path.replace(/^\/+/, "")}`, {
            ...options,
            credentials: "include",
            headers,
        })

        const payload = response.status === 204
            ? null
            : await response.json() as ApiSuccess<T> | ApiFailure

        if (!response.ok) {
            const failure = payload as ApiFailure

            throw new ApiError(
                failure.error?.message ?? `API request failed with status ${response.status}`,
                response.status,
                response,
                failure.error,
                failure.meta,
            )
        }

        if (response.status === 204) {
            return undefined as T
        }

        return (payload as ApiSuccess<T>).data
    }

    get<T>(path: string, options?: Omit<RequestInit, "method" | "body">) {
        return this.request<T>(path, { ...options, method: "GET" })
    }

    post<T>(
        path: string,
        body?: unknown,
        options?: Omit<RequestInit, "method" | "body">,
    ) {
        return this.request<T>(path, {
            ...options,
            method: "POST",
            body: body === undefined ? undefined : JSON.stringify(body),
        })
    }
}

export const api = ApiClient.getInstance()
