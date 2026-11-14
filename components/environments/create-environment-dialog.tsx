"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateEnvironment } from "@/hooks/environments/mutations"
import type { Environment } from "@/lib/api/environment"
import { getErrorMessage } from "@/lib/errors"

export function CreateEnvironmentDialog({
    projectId,
    open,
    onOpenChange,
    onCreated,
}: {
    projectId: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated: (environment: Environment) => void
}) {
    const [name, setName] = useState("")
    const [validationError, setValidationError] = useState<string>()
    const createEnvironment = useCreateEnvironment(projectId)

    const close = () => {
        if (createEnvironment.isPending) return
        onOpenChange(false)
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedName = name.trim()
        if (!trimmedName) {
            setValidationError("Enter an environment name.")
            return
        }
        setValidationError(undefined)
        try {
            const environment = await createEnvironment.mutateAsync(trimmedName)
            onCreated(environment)
            onOpenChange(false)
        } catch {
            // The mutation error is rendered below.
        }
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => nextOpen ? onOpenChange(true) : close()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create environment</DialogTitle>
                    <DialogDescription>Give this environment a name such as Development or Staging.</DialogDescription>
                </DialogHeader>
                <form onSubmit={(event) => void submit(event)} className="space-y-5">
                    <Field data-invalid={Boolean(validationError)}>
                        <FieldLabel htmlFor="new-environment-name">Name</FieldLabel>
                        <Input
                            id="new-environment-name"
                            autoFocus
                            maxLength={100}
                            placeholder="Development"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={createEnvironment.isPending}
                            aria-invalid={Boolean(validationError)}
                        />
                        {validationError && <FieldError>{validationError}</FieldError>}
                    </Field>
                    {createEnvironment.isError && <p role="alert" className="text-sm text-destructive">{getErrorMessage(createEnvironment.error, "Could not create the environment.")}</p>}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close} disabled={createEnvironment.isPending}>Cancel</Button>
                        <Button type="submit" disabled={createEnvironment.isPending}>{createEnvironment.isPending ? "Creating…" : "Create environment"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
