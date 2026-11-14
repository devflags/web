import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardNavigation } from "@/components/dashboard/dashboard-navigation"
import { authFetch, type AuthOrganization, type AuthSessionResponse } from "@/lib/auth-fetch"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookie = (await headers()).get("cookie")

    if (!cookie) redirect("/sign-in")

    const session = await authFetch<AuthSessionResponse>("get-session", cookie)
    if (!session) redirect("/sign-in")

    const organizations = await authFetch<AuthOrganization[]>("organization/list", cookie)
    if (!organizations || organizations.length === 0) redirect("/onboarding/organization")

    return (
        <div className="flex h-svh min-h-0 flex-col overflow-hidden">
            <DashboardNavigation
                user={session.user}
                organizations={organizations}
                activeOrganizationId={session.session.activeOrganizationId}
            />
            <main className="dashboard-content-padding flex min-h-0 flex-1 flex-col overflow-y-auto py-8 xl:px-86">
                {children}
            </main>
        </div>
    )
}
