"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Box, Building2, Check, ChevronDown, Command, FolderKanban, FolderOpenDot, LayoutGrid, LogOut, Plus, Settings, Terminal, Users } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { CreateEnvironmentDialog } from "@/components/environments/create-environment-dialog"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetEnvironments } from "@/hooks/environments/queries"
import { useGetProjects } from "@/hooks/projects/queries"
import { authClient } from "@/lib/auth-client"
import type { AuthOrganization } from "@/lib/auth-fetch"

type DashboardUser = { name: string; email: string; image?: string | null }

export function DashboardNavigation({
    user,
    organizations,
    activeOrganizationId,
}: {
    user: DashboardUser
    organizations: AuthOrganization[]
    activeOrganizationId: string | null
}) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const projectId = pathname.match(/^\/projects\/([^/]+)/)?.[1]
    const routeEnvironmentId = pathname.match(/^\/projects\/[^/]+\/environments\/([^/]+)/)?.[1]
    const { data: session } = authClient.useSession()
    const activeOrgId = session?.session.activeOrganizationId ?? activeOrganizationId
    const activeOrganization = organizations.find((organization) => organization.id === activeOrgId) ?? organizations[0]
    const { data: projects = [] } = useGetProjects()
    const currentProject = projects.find((project) => project.id === projectId)
    const { data: environments = [], isLoading: environmentsLoading } = useGetEnvironments(projectId)
    const selectedEnvironment = environments.find((environment) => environment.id === routeEnvironmentId)
    const isProjectContext = Boolean(projectId)
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [isCreateEnvironmentOpen, setIsCreateEnvironmentOpen] = useState(false)

    useEffect(() => {
        if (!activeOrgId && organizations[0]) {
            void authClient.organization.setActive({ organizationId: organizations[0].id })
        }
    }, [activeOrgId, organizations])

    useEffect(() => {
        if (!projectId || environmentsLoading || !pathname.match(/^\/projects\/[^/]+\/environments\/[^/]+/)) return

        if (environments.length === 0) {
            if (routeEnvironmentId !== "new") router.replace(`/projects/${projectId}/environments/new`)
            return
        }

        if (routeEnvironmentId === "new") return
        if (routeEnvironmentId && !environments.some((environment) => environment.id === routeEnvironmentId)) {
            const suffix = pathname.match(/^\/projects\/[^/]+\/environments\/[^/]+(.*)$/)?.[1] ?? ""
            router.replace(`/projects/${projectId}/environments/${environments[0].id}${suffix}`)
        }
    }, [environments, environmentsLoading, pathname, projectId, routeEnvironmentId, router])

    const switchOrganization = async (organizationId: string) => {
        const { error } = await authClient.organization.setActive({ organizationId })
        if (error) return
        router.push("/")
        router.refresh()
    }

    const switchProject = (nextProjectId: string) => router.push(`/projects/${nextProjectId}`)

    const switchEnvironment = (environmentId: string) => {
        const routeMatch = pathname.match(/^\/projects\/[^/]+\/environments\/[^/]+(.*)$/)
        const suffix = routeMatch?.[1] === "/new" ? "" : routeMatch?.[1] ?? ""
        const params = new URLSearchParams(searchParams.toString())
        params.delete("environment")
        const query = params.size ? `?${params.toString()}` : ""
        router.replace(`/projects/${projectId}/environments/${environmentId}${suffix}${query}`)
    }

    const tabs = isProjectContext && projectId
        ? selectedEnvironment
            ? [
                { label: "Overview", href: `/projects/${projectId}/environments/${selectedEnvironment.id}`, icon: Box },
                { label: "Flags", href: `/projects/${projectId}/environments/${selectedEnvironment.id}/flags`, icon: Terminal },
                { label: "Settings", href: `/projects/${projectId}/environments/${selectedEnvironment.id}/settings`, icon: Settings },
            ]
            : []
        : [
            { label: "Overview", href: "/", icon: Box },
            { label: "Projects", href: "/projects", icon: FolderKanban },
            { label: "Team", href: "/team", icon: Users },
            { label: "Settings", href: "/settings", icon: Settings },
        ]

    return (
        <header className="shrink-0 border-b bg-background">
            <div className="flex h-16 min-w-0 flex-nowrap items-center gap-2 px-3 sm:px-4 md:px-8">
                <Link href="/" aria-label="DevFlags home" className="mr-1 flex h-9 shrink-0 items-center gap-2 pr-1 font-semibold tracking-tight sm:mr-2 sm:pr-2">
                    <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"><Command className="size-4" /></span>
                    <span className="hidden sm:inline">DevFlags</span>
                </Link>
                <div className="hidden h-6 w-px shrink-0 bg-border sm:block" />

                <div className="flex min-w-0 flex-1 touch-pan-x items-center gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <ContextSelector label="Organization" icon={Building2} value={activeOrganization?.name ?? "Organization"} >
                        <DropdownMenuGroup><DropdownMenuLabel>Organizations</DropdownMenuLabel></DropdownMenuGroup>
                        {organizations.map((organization) => (
                            <DropdownMenuItem key={organization.id} onClick={() => void switchOrganization(organization.id)}>
                                <span className="flex-1">{organization.name}</span>
                                {organization.id === activeOrgId && <Check className="size-4" />}
                            </DropdownMenuItem>
                        ))}
                    </ContextSelector>

                    <ContextSeparator />

                    <ContextSelector
                        label="Project"
                        icon={FolderOpenDot}
                        value={currentProject?.name ?? (isProjectContext ? "Loading project…" : "Select project")}
                    >
                        <DropdownMenuGroup><DropdownMenuLabel>Projects</DropdownMenuLabel></DropdownMenuGroup>
                        {projects.map((project) => (
                            <DropdownMenuItem key={project.id} onClick={() => switchProject(project.id)}>
                                <span className="flex-1">{project.name}</span>
                                {project.id === projectId && <Check className="size-4" />}
                            </DropdownMenuItem>
                        ))}
                        {projects.length === 0 && <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsCreateProjectOpen(true)}><Plus /> Create project</DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/projects" />}><LayoutGrid /> All projects</DropdownMenuItem>
                    </ContextSelector>

                    {isProjectContext && (
                        <>
                            <ContextSeparator />
                            <ContextSelector
                                label="Environment"
                                icon={Box}
                                value={environmentsLoading ? "Loading…" : selectedEnvironment?.name ?? "No environments"}
                            >
                                <DropdownMenuGroup><DropdownMenuLabel>Environments</DropdownMenuLabel></DropdownMenuGroup>
                                {environments.map((environment) => (
                                    <DropdownMenuItem key={environment.id} onClick={() => switchEnvironment(environment.id)}>
                                        <span className="flex-1">{environment.name}</span>
                                        {environment.id === selectedEnvironment?.id && <Check className="size-4" />}
                                    </DropdownMenuItem>
                                ))}
                                {environments.length === 0 && <DropdownMenuItem disabled>No environments available</DropdownMenuItem>}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setIsCreateEnvironmentOpen(true)}><Plus /> Create environment</DropdownMenuItem>
                            </ContextSelector>
                        </>
                    )}

                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 gap-2 px-2" aria-label="User menu" />}>
                            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                            </span>
                            <span className="hidden max-w-36 truncate text-sm sm:block">{user.name}</span>
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="font-normal">
                                    <span className="block truncate font-medium text-foreground">{user.name}</span>
                                    <span className="block truncate text-muted-foreground">{user.email}</span>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => void authClient.signOut().then(() => router.replace("/sign-in"))}>
                                <LogOut className="size-4" /> Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <nav aria-label={isProjectContext ? "Project navigation" : "Organization navigation"} className="flex h-12 items-end gap-1 overflow-x-auto px-4 md:px-8">
                {tabs.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (label !== "Overview" && href !== "/" && pathname.startsWith(`${href}/`))
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm transition-colors ${active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        >
                            <Icon className="size-4" />{label}
                        </Link>
                    )
                })}
            </nav>
            <CreateProjectDialog
                open={isCreateProjectOpen}
                onOpenChange={setIsCreateProjectOpen}
                onCreated={(project) => router.push(`/projects/${project.id}`)}
            />
            {projectId && (
                <CreateEnvironmentDialog
                    projectId={projectId}
                    open={isCreateEnvironmentOpen}
                    onOpenChange={setIsCreateEnvironmentOpen}
                    onCreated={(environment) => {
                        const routeMatch = pathname.match(/^\/projects\/[^/]+\/environments\/[^/]+(.*)$/)
                        const suffix = routeMatch?.[1] === "/new" ? "" : routeMatch?.[1] ?? ""
                        const params = new URLSearchParams(searchParams.toString())
                        params.delete("environment")
                        const query = params.size ? `?${params.toString()}` : ""
                        router.replace(`/projects/${projectId}/environments/${environment.id}${suffix}${query}`)
                    }}
                />
            )}
        </header>
    )
}

function ContextSelector({
    label,
    icon: Icon,
    value,
    iconOnly = false,
    children,
}: {
    label: string
    icon: typeof Box
    value: string
    iconOnly?: boolean
    children: React.ReactNode
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" aria-label={`${label}: ${value}`} className={`h-10 max-w-56 justify-start gap-2.5 text-[0.95rem] ${iconOnly ? "px-3.5" : "px-4"}`} />}>
                <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                {!iconOnly && <span className="max-w-40 truncate font-medium">{value}</span>}
                {!iconOnly && <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">{children}</DropdownMenuContent>
        </DropdownMenu>
    )
}

function ContextSeparator() {
    return <span aria-hidden="true" className="shrink-0 select-none text-base text-muted-foreground/50">/</span>
}
