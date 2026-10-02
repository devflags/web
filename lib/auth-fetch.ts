const AUTH_URL = (
    process.env.BETTER_AUTH_URL ?? "http://localhost:4000/api"
).replace(/\/+$/, "")

export type AuthSessionResponse = {
    session: {
        activeOrganizationId: string | null
    }
    user: {
        id: string
        name: string
        email: string
        image?: string | null
    }
}

export type AuthOrganization = {
    id: string
    name: string
    slug: string
}

export async function authFetch<T>(
    path: string,
    cookie: string,
): Promise<T | null> {
    const response = await fetch(`${AUTH_URL}/auth/${path.replace(/^\/+/, "")}`, {
        headers: { cookie },
        cache: "no-store",
    })

    if (!response.ok) {
        return null
    }

    return response.json() as Promise<T>
}
