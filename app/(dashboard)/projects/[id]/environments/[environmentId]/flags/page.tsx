"use client"

import { useState } from "react"
import { Flag as FlagIcon, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { CreateFlagDialog } from "@/components/flags/create-flag-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { useGetFlags } from "@/hooks/flags/queries"
import { getErrorMessage } from "@/lib/errors"
import { DataTable } from "@/components/tables/flags/data-table"
import { columns } from "@/components/tables/flags/columns"
import { type Flag } from "@/lib/api/flags"

export default function FlagsPage() {
    const params = useParams<{ id: string; environmentId: string }>()
    const router = useRouter()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { data: flags, isLoading, isError, error } = useGetFlags(params.id, params.environmentId)

    const openCreateDialog = () => setIsCreateModalOpen(true)
    const openFlag = (flag: Flag) => {
        router.push(`/projects/${params.id}/environments/${params.environmentId}/flags/${flag.id}`)
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Flags</h1>
                <Button type="button" onClick={openCreateDialog}>
                    <Plus />
                    Create Flag
                </Button>
            </header>
            {isLoading ? (
                <p className="text-muted-foreground">Loading flags…</p>
            ) : isError ? (
                <p className="text-destructive">{getErrorMessage(error, "Unable to load flags.")}</p>
            ) : !flags || flags.data.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col">
                    <EmptyState
                        icon={FlagIcon}
                        title="No flags yet"
                        description="Flags let you ship a feature dark and turn it on later, without redeploying or rolling back."
                        action={
                            <Button type="button" onClick={openCreateDialog}>
                                <Plus />
                                Create your first flag
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="w-full">
                    <DataTable columns={columns} data={flags.data} onRowClick={openFlag} />
                </div>
            )}
            <CreateFlagDialog
                projectId={params.id}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div>
    )
}
