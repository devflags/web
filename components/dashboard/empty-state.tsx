import * as React from "react"
import { cn } from "cn"

type EmptyStateProps = {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center",
                className,
            )}
        >
            <div className="flex size-11 items-center justify-center rounded-full border bg-muted/50">
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-base font-semibold">{title}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}