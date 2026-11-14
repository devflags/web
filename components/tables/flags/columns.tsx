"use client"

import { Check, CircleCheck, CircleDashed, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { type Flag } from "@/lib/api/flags"
import { Button } from "@/components/ui/button"
import { createColumnHelper, type CellContext } from "@tanstack/react-table"
import { type DataTableFeatures } from "./data-table-features"

function FlagNameCell({ row }: CellContext<DataTableFeatures, Flag>) {
    const { name, key, description } = row.original
    const [copied, setCopied] = useState(false)

    async function copyKey() {
        try {
            await navigator.clipboard.writeText(key)
            setCopied(true)
            toast.success("Flag key copied")
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            toast.error("Could not copy the flag key")
        }
    }

    return (
        <div className="min-w-[220px] py-1">
            <p className="font-medium text-foreground">{name}</p>
            <div className="mt-1 flex items-center gap-1.5">
                <code className="text-xs text-muted-foreground">{key}</code>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Copy key ${key}`}
                    onClick={copyKey}
                >
                    {copied ? <Check className="text-emerald-600" /> : <Copy />}
                </Button>
            </div>
            {description && (
                <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}

function FlagTypeCell({ row }: CellContext<DataTableFeatures, Flag>) {
    return (
        <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium lowercase text-muted-foreground">
            {row.original.type.toLowerCase()}
        </span>
    )
}

function ConfigurationCell({ row }: CellContext<DataTableFeatures, Flag>) {
    const isConfigured = row.original.environments.some((environment) => environment.enabled)

    return (
        <span className="inline-flex items-center gap-1.5 text-sm">
            {isConfigured ? (
                <>
                    <CircleCheck className="size-4 text-emerald-600" />
                    <span>Configured</span>
                </>
            ) : (
                <>
                    <CircleDashed className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Not configured</span>
                </>
            )}
        </span>
    )
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Flag>()

export const columns = columnHelper.columns([
    columnHelper.accessor("name", {
        id: "flag",
        header: "Flag",
        cell: FlagNameCell,
    }),
    columnHelper.accessor("type", {
        header: "Type",
        cell: FlagTypeCell,
    }),
    columnHelper.display({
        id: "configuration",
        header: "Configuration",
        cell: ConfigurationCell,
    }),
])