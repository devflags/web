"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useCreateFlag from "@/hooks/flags/mutations"
import { FeatureFlagType } from "@/lib/api/flags"
import { getErrorMessage } from "@/lib/errors"
import { createFlagSchema, CreateFlagFormValues, toFlagKey } from "@/lib/validations/flags"

type CreateFlagDialogProps = {
    projectId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateFlagDialog({ projectId, open, onOpenChange }: CreateFlagDialogProps) {
    const { mutate, reset: resetCreateFlag, isPending, isError, error } = useCreateFlag(projectId)
    const [isKeyEdited, setIsKeyEdited] = useState(false)
    const form = useForm<CreateFlagFormValues>({
        resolver: zodResolver(createFlagSchema),
        defaultValues: { key: "", name: "", description: "", type: FeatureFlagType.BOOLEAN },
    })

    const nameField = form.register("name")

    // deps are the stable functions only: the object returned by useMutation is a
    // new object on every render, which would re-run this effect (and loop) on
    // the state update that reset() itself triggers
    useEffect(() => {
        if (open) {
            form.reset()
            resetCreateFlag()
            setIsKeyEdited(false)
        }
    }, [open, form, resetCreateFlag])

    function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        nameField.onChange(event)
        // keep generating the key from the name until the user takes it over
        if (!isKeyEdited) {
            form.setValue("key", toFlagKey(event.target.value), { shouldDirty: true })
        }
    }

    function onKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIsKeyEdited(true)
        form.setValue("key", toFlagKey(event.target.value), { shouldDirty: true })
    }

    function close() {
        if (isPending) return
        onOpenChange(false)
        form.reset()
        resetCreateFlag()
    }

    function onSubmit(values: CreateFlagFormValues) {
        mutate(
            { ...values, description: values.description || undefined },
            { onSuccess: close },
        )
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) close()
            }}
        >
            <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="create-flag-title">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="create-flag-title" className="text-lg font-semibold">Add a flag</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Control a feature for this project.</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={close}><X /></Button>
                </div>

                <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                    <Field data-invalid={Boolean(form.formState.errors.name)}>
                        <FieldLabel htmlFor="flag-name">Name</FieldLabel>
                        <Input id="flag-name" placeholder="New checkout" maxLength={100} autoFocus disabled={isPending} aria-invalid={Boolean(form.formState.errors.name)} {...nameField} onChange={onNameChange} />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>
                    <Field data-invalid={Boolean(form.formState.errors.key)}>
                        <FieldLabel htmlFor="flag-key">Key</FieldLabel>
                        <Input id="flag-key" placeholder="new-checkout" maxLength={100} disabled={isPending} aria-invalid={Boolean(form.formState.errors.key)} {...form.register("key")} onChange={onKeyChange} />
                        <FieldDescription>Lowercase letters, numbers, hyphens and underscores. Generated from the name.</FieldDescription>
                        <FieldError errors={[form.formState.errors.key]} />
                    </Field>
                    <Field data-invalid={Boolean(form.formState.errors.type)}>
                        <FieldLabel htmlFor="flag-type">Type</FieldLabel>
                        <select id="flag-type" className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" disabled={isPending} {...form.register("type")}>
                            {Object.values(FeatureFlagType).map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <FieldError errors={[form.formState.errors.type]} />
                    </Field>
                    <Field data-invalid={Boolean(form.formState.errors.description)}>
                        <FieldLabel htmlFor="flag-description">Description</FieldLabel>
                        <Textarea id="flag-description" placeholder="What does this flag control?" maxLength={500} disabled={isPending} aria-invalid={Boolean(form.formState.errors.description)} {...form.register("description")} />
                        <FieldError errors={[form.formState.errors.description]} />
                    </Field>

                    {isError && <FieldDescription className="text-destructive">{getErrorMessage(error, "Could not create the flag.")}</FieldDescription>}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={close} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create"}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
