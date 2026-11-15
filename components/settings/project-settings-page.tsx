"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Check, CircleDashed, Clock3, Copy, KeyRound, Layers3, Settings2 } from "lucide-react"

import { useGetEnvironments } from "@/hooks/environments/queries"
import { useGetProject } from "@/hooks/projects/queries"
import type { Environment } from "@/lib/api/environment"
import type { Project } from "@/lib/api/projects"
import { getErrorMessage } from "@/lib/errors"
import { cn } from "@/lib/utils"

type SettingsSection = "environment" | "api-keys" | "updates" | "project"

const formatDate = (date?: string) => date
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(date))
    : "—"

export function ProjectSettingsPage({ section = "environment" }: { section?: SettingsSection }) {
    const { id: projectId, environmentId } = useParams<{ id: string; environmentId: string }>()
    const { data: project, isLoading: isProjectLoading, isError: isProjectError, error: projectError } = useGetProject(projectId)
    const { data: environments = [], isLoading: areEnvironmentsLoading, isError: areEnvironmentsError, error: environmentsError } = useGetEnvironments(projectId)
    const environment = environments.find((item) => item.id === environmentId)
    const base = `/projects/${projectId}/environments/${environmentId}/settings`

    if (isProjectLoading || areEnvironmentsLoading) {
        return <p className="text-sm text-muted-foreground">Loading settings…</p>
    }
    if (isProjectError || areEnvironmentsError) {
        return <p role="alert" className="text-sm text-destructive">{getErrorMessage(projectError ?? environmentsError, "Unable to load settings.")}</p>
    }
    if (!project || !environment) {
        return <p role="alert" className="text-sm text-destructive">This project environment could not be found.</p>
    }

    return (
        <div className="grid min-w-0 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <SettingsNavigation base={base} environment={environment} project={project} section={section} />
            <main className="min-w-0 pb-8">
                {section === "environment" && <EnvironmentSettings environment={environment} />}
                {section === "project" && <ProjectSettings project={project} />}
                {section === "api-keys" && <ComingSoon title="API keys" description="Manage the keys used by your SDKs to connect to this environment." icon={<KeyRound />} />}
                {section === "updates" && <ComingSoon title="Updates" description="Review changes and activity for this environment." icon={<Clock3 />} />}
            </main>
        </div>
    )
}

function SettingsNavigation({
    base,
    environment,
    project,
    section,
}: {
    base: string
    environment: Environment
    project: Project
    section: SettingsSection
}) {
    const environmentLinks = [
        { label: "Settings", href: base, section: "environment" as const, icon: Settings2 },
        { label: "API keys", href: `${base}/api-keys`, section: "api-keys" as const, icon: KeyRound },
        { label: "Updates", href: `${base}/updates`, section: "updates" as const, icon: Clock3 },
    ]
    const projectHref = `${base}/project`

    return (
        <aside className="min-w-0 lg:sticky lg:top-0 lg:self-start">
            <div className="space-y-6 lg:space-y-7">
                <SettingsNavGroup title="Environment" items={environmentLinks} activeSection={section} />
                <SettingsNavGroup
                    title="Project"
                    items={[{ label: "Settings", href: projectHref, section: "project", icon: Layers3 }]}
                    activeSection={section}
                />
            </div>
            <div className="mt-8 hidden border-t pt-4 text-xs text-muted-foreground lg:block">
                <p className="truncate font-medium text-foreground">{project.name}</p>
                <p className="mt-1 truncate">{environment.name} environment</p>
            </div>
        </aside>
    )
}

function SettingsNavGroup({
    title,
    items,
    activeSection,
}: {
    title: string
    items: { label: string; href: string; section: SettingsSection; icon: typeof Settings2 }[]
    activeSection: SettingsSection
}) {
    return (
        <section>
            <h2 className="mb-2 px-3 text-xs font-medium text-muted-foreground">{title}</h2>
            <nav aria-label={`${title} settings`} className="flex gap-1 overflow-x-auto sm:flex-wrap lg:flex-col">
                {items.map(({ label, href, section, icon: Icon }) => (
                    <Link
                        key={section}
                        href={href}
                        aria-current={activeSection === section ? "page" : undefined}
                        className={cn(
                            "flex h-9 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
                            activeSection === section
                                ? "bg-muted font-medium text-foreground"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                    >
                        <Icon className="size-4" aria-hidden="true" />
                        {label}
                    </Link>
                ))}
            </nav>
        </section>
    )
}

function EnvironmentSettings({ environment }: { environment: Environment }) {
    return (
        <>
            <PageHeading title={`${environment.name} environment settings`} description="View the details for this environment." />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_230px]">
                <section className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-medium">Environment details</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Basic information about this environment.</p>
                    </div>
                    <dl className="divide-y">
                        <DetailRow label="Name" value={environment.name} />
                        <DetailRow label="Slug" value={environment.slug} mono />
                    </dl>
                </section>
                <MetadataPanel label="Environment ID" id={environment.id} createdAt={environment.createdAt} />
            </div>
        </>
    )
}

function ProjectSettings({ project }: { project: Project }) {
    return (
        <>
            <PageHeading title={`${project.name} project settings`} description="Project-wide settings apply across all environments." />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_230px]">
                <section className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-medium">Project details</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Basic information shared by this project.</p>
                    </div>
                    <dl className="divide-y">
                        <DetailRow label="Name" value={project.name} />
                        <DetailRow label="Slug" value={project.slug ?? "—"} mono />
                    </dl>
                </section>
                <MetadataPanel label="Project ID" id={project.id} createdAt={project.createdAt} />
            </div>
        </>
    )
}

function PageHeading({ title, description }: { title: string; description: string }) {
    return (
        <header className="mb-7 border-b pb-5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </header>
    )
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className={cn("break-all text-sm font-medium", mono && "font-mono text-xs")}>{value}</dd>
        </div>
    )
}

function MetadataPanel({ label, id, createdAt }: { label: string; id: string; createdAt?: string }) {
    return (
        <aside className="space-y-4 rounded-xl border bg-card p-5 xl:border-0 xl:bg-transparent xl:p-0">
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <CopyableId id={id} />
            </div>
            <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">Created on</p>
                <p className="mt-1 text-sm font-medium">{formatDate(createdAt)}</p>
            </div>
        </aside>
    )
}

function CopyableId({ id }: { id: string }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(id)
            setCopied(true)
            toast.success("ID copied")
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            toast.error("Could not copy ID")
        }
    }

    return (
        <div className="mt-1 flex items-start gap-2">
            <code className="min-w-0 flex-1 break-all text-sm font-medium">{id}</code>
            <button type="button" onClick={() => void copy()} aria-label={`Copy ${id}`} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </button>
        </div>
    )
}

function ComingSoon({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
    return (
        <>
            <PageHeading title={title} description={description} />
            <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">{icon}</div>
                <h2 className="mt-4 font-medium">Nothing here yet</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">This settings section is ready for when you add {title.toLowerCase()} management.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    <CircleDashed className="size-3.5" /> Coming soon
                </span>
            </section>
        </>
    )
}
