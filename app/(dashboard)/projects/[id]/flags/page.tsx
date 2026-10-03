"use client"

import { useState } from "react"
import { Flag as FlagIcon, Plus } from "lucide-react"
import { useParams } from "next/navigation"

import { CreateFlagDialog } from "@/components/flags/create-flag-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { useGetFlags } from "@/hooks/flags/queries"
import { getErrorMessage } from "@/lib/errors"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"

export default function FlagsPage() {
    const params = useParams<{ id: string }>()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { data: flags, isLoading, isError, error } = useGetFlags(params.id)

    if (isLoading) return <p>A carregar flags...</p>
    if (isError) {
        return <p className="text-destructive">{getErrorMessage(error, "Não foi possível carregar as flags.")}</p>
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-start gap-3">
                    <BreadcrumbNav />
                </div>
                <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus />
                    Create Flag
                </Button>
            </header>
            {!flags || flags.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col pt-6">
                    <EmptyState
                        icon={FlagIcon}
                        title="No flags yet"
                        description="Flags let you ship a feature dark and turn it on later, without redeploying or rolling back."
                        action={
                            <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
                                <Plus />
                                Create your first flag
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
                    {flags.map((flag) => (
                        <div key={flag.id} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="font-semibold">{flag.name}</h2>
                                <span className="rounded bg-muted px-2 py-0.5 text-xs">{flag.type}</span>
                            </div>
                            <p className="mt-1 font-mono text-sm text-muted-foreground">{flag.key}</p>
                            {flag.description && <p className="mt-3 text-sm text-muted-foreground">{flag.description}</p>}
                        </div>
                    ))}
                </div>
            )}
            <CreateFlagDialog projectId={params.id} open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
        </div>
    )
}
