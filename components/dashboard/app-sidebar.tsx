"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ArrowLeft,
    Box,
    ChevronRight,
    FolderKanban,
    Home,
    Rocket,
    Settings,
    Terminal,
    Command,
} from "lucide-react"

import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import { useGetProjects } from "@/hooks/projects/queries"
import { useGetEnvironments } from "@/hooks/environments/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { type Environment } from "@/lib/api/environment"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"

type SidebarUser = {
    name: string
    email: string
    image?: string | null
}

type SidebarOrganization = {
    id: string
    name: string
    slug: string
}

export function AppSidebar({
    user,
    organizations,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: SidebarUser
    organizations: SidebarOrganization[]
}) {
    const pathname = usePathname()
    const { data: projects } = useGetProjects()
    const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
    const projectId = projectMatch?.[1]
    const currentProject = projects?.find((project) => project.id === projectId)
    const isProjectContext = Boolean(projectId)
    const { data: environments, isLoading: isEnvironmentsLoading } = useGetEnvironments(projectId)

    return (
        <Sidebar variant="floating" collapsible="icon" {...props}>
            {isProjectContext ? (
                <SidebarHeader>
                    <TeamSwitcher
                        teams={organizations.map((organization) => ({
                            name: organization.name,
                            logo: Command,
                            plan: "Organization",
                        }))}
                    />
                </SidebarHeader>
            ) : (
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" render={<Link href="/" />}>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                                    DevFlags
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            )}

            <SidebarContent>
                {isProjectContext ? (
                    <>
                        {projectId && (
                            <>
                                <ProjectNavigation
                                    projectId={projectId}
                                    projectName={currentProject?.name ?? "Project"}
                                    environments={environments ?? []}
                                    isEnvironmentsLoading={isEnvironmentsLoading}
                                />
                                <ProjectSettings projectId={projectId} />
                            </>
                        )}
                    </>
                ) : (
                    <GlobalNavigation />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

function GlobalNavigation() {
    return (
        <>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href="/" />}>
                            <Home />
                            <span>Overview</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href="/projects" />}>
                            <FolderKanban />
                            <span>Projects</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href="/settings" />}>
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}

function ProjectNavigation({
    projectId,
    projectName,
    environments,
    isEnvironmentsLoading,
}: {
    projectId: string
    projectName: string
    environments: Environment[]
    isEnvironmentsLoading: boolean
}) {
    const basePath = `/projects/${projectId}`

    return (
        <>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href="/projects" />}>
                            <ArrowLeft />
                            <span>Projects</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>{projectName}</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href={basePath} />}>
                            <Rocket />
                            <span>Overview</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href={`${basePath}/flags`} />}>
                            <Terminal />
                            <span>Flags</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Box />
                            <span>Environments</span>
                            <ChevronRight className="ml-auto" />
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                            {isEnvironmentsLoading ? (
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton>
                                        <Skeleton className="h-4 w-24" />
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ) : environments.map((environment) => (
                                <SidebarMenuSubItem key={environment.id}>
                                    <SidebarMenuSubButton
                                        render={
                                            <Link
                                                href={`${basePath}/environments/${environment.id}`}
                                            />
                                        }
                                    >
                                        <span>{environment.name}</span>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}

function ProjectSettings({ projectId }: { projectId: string }) {
    return (
        <SidebarGroup className="mt-auto">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        render={<Link href={`/projects/${projectId}/settings`} />}
                    >
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
