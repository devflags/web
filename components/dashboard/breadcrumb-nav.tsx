"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderKanban, ChevronDown, Rocket, Terminal, Check } from "lucide-react"

import { useGetProject } from "@/hooks/projects/queries"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProjectPage = {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

function getProjectPages(projectId: string): ProjectPage[] {
    const base = `/projects/${projectId}`
    return [
        {
            href: base,
            label: "Overview",
            icon: Rocket,
        },
        {
            href: `${base}/flags`,
            label: "Flags",
            icon: Terminal,
        },
    ]
}

export function BreadcrumbNav() {
    const pathname = usePathname()

    const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
    const projectId = projectMatch?.[1]
    const { data: currentProject } = useGetProject(projectId ?? "")

    if (!projectId) {
        return null
    }

    const pages = getProjectPages(projectId)
    // nested routes (ex: /projects/:id/flags/:flagId) also match the parent's
    // href as a prefix, so pick the deepest match instead of the first one
    const currentPage =
        pages
            .filter(
                (page) =>
                    pathname === page.href ||
                    pathname.startsWith(`${page.href}/`)
            )
            .sort((a, b) => b.href.length - a.href.length)[0] ?? pages[0]

    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap gap-2 text-base">
                <BreadcrumbItem>
                    <BreadcrumbLink
                        render={<Link href={`/projects/${projectId}`} />}
                        className="flex items-center gap-2 font-semibold text-foreground"
                    >
                        <FolderKanban className="size-5 text-muted-foreground" />
                        <span>{currentProject?.name ?? "Project"}</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground/60">
                    /
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            nativeButton={false}
                            render={
                                <BreadcrumbPage className="flex cursor-pointer items-center gap-1.5 text-muted-foreground hover:text-foreground" />
                            }
                        >
                            <span className="flex items-center gap-1.5">
                                {currentPage.label}
                                <ChevronDown className="size-3.5" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {pages.map((page) => (
                                <DropdownMenuItem
                                    key={page.href}
                                    render={<Link href={page.href} />}
                                    className="pl-2"
                                >
                                    <page.icon className="size-4 text-muted-foreground" />
                                    <span className="flex-1">{page.label}</span>
                                    {page.href === currentPage.href && (
                                        <Check className="size-4" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}