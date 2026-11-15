"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCreateEnvironment } from "@/hooks/environments/mutations"
import { useGetEnvironments } from "@/hooks/environments/queries"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function CreateFirstEnvironmentPage() {
    const { id: projectId } = useParams<{ id: string }>()
    const router = useRouter()
    const [name, setName] = useState("")
    const [validationError, setValidationError] = useState<string>()
    const createEnvironment = useCreateEnvironment(projectId)
    const { data: environments, isLoading: isEnvironmentsLoading, isError: isEnvironmentsError } = useGetEnvironments(projectId)

    useEffect(() => {
        if (!environments?.length) return
        router.replace(`/projects/${projectId}/environments/${environments[0].id}`)
    }, [environments, projectId, router])

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
            router.replace(`/projects/${projectId}/environments/${environment.id}`)
        } catch {
            // The mutation error is displayed in the form.
        }
    }

    return (
        <div className="flex min-h-0 flex-1 items-start justify-center pt-8 sm:pt-14">
            <section className="w-full max-w-lg rounded-xl border bg-card p-6 sm:p-8">
                <h1 className="text-2xl font-semibold tracking-tight">Create your first environment</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Every project needs an environment. Create one to start managing flags and their targeting rules.
                </p>
                <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-5">
                    {isEnvironmentsLoading ? <p className="text-sm text-muted-foreground">Checking project environments…</p> : null}
                    {isEnvironmentsError ? <p role="alert" className="text-sm text-destructive">Unable to load project environments.</p> : null}
                    <Field data-invalid={Boolean(validationError)}>
                        <FieldLabel htmlFor="first-environment-name">Environment name</FieldLabel>
                        <Input
                            id="first-environment-name"
                            autoFocus
                            maxLength={100}
                            placeholder="Development"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={createEnvironment.isPending || isEnvironmentsLoading || isEnvironmentsError}
                            aria-invalid={Boolean(validationError)}
                        />
                        {validationError && <FieldError>{validationError}</FieldError>}
                    </Field>
                    {createEnvironment.isError && (
                        <p role="alert" className="text-sm text-destructive">
                            {getErrorMessage(createEnvironment.error, "Could not create the environment.")}
                        </p>
                    )}
                    <Button type="submit" disabled={createEnvironment.isPending || isEnvironmentsLoading || isEnvironmentsError}>
                        {createEnvironment.isPending ? "Creating…" : "Create environment"}
                    </Button>
                </form>
            </section>
        </div>
    )
}
