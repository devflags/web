import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
    authFetch,
    type AuthOrganization,
    type AuthSessionResponse,
} from "@/lib/auth-fetch"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const cookie = (await headers()).get("cookie")

    if (!cookie) {
        redirect("/sign-in")
    }

    const session = await authFetch<AuthSessionResponse>("get-session", cookie)

    if (!session) {
        redirect("/sign-in")
    }

    const organizations = await authFetch<AuthOrganization[]>(
        "organization/list",
        cookie,
    )

    if (!organizations || organizations.length === 0) {
        redirect("/onboarding/organization")
    }

    return (
        <SidebarProvider className="h-svh min-h-0 overflow-hidden">
            <AppSidebar user={session.user} organizations={organizations} />
            <SidebarInset className="min-h-0 overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-6">
                        <SidebarTrigger className="-ml-1 !size-12 [&_svg]:!size-4" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4 mt-4"
                        />
                        <h1 className="text-md font-semibold tracking-tight">
                            DevFlags
                        </h1>
                    </div>

                </header>
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-10">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
