"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useCreateProject from "@/hooks/projects/mutations"
import { getErrorMessage } from "@/lib/errors"
import {
    createProjectSchema,
    CreateProjectFormValues,
} from "@/lib/validations/projects"

type CreateProjectDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({
    open,
    onOpenChange,
}: CreateProjectDialogProps) {
    const createProject = useCreateProject()
    const form = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: { name: "", description: "" },
    })

    useEffect(() => {
        if (open) {
            form.reset()
            createProject.reset()
        }
    }, [open, form, createProject])

    function close() {
        if (createProject.isPending) return
        onOpenChange(false)
        form.reset()
        createProject.reset()
    }

    function onSubmit(values: CreateProjectFormValues) {
        createProject.mutate(
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
            <div
                className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-project-title"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="create-project-title" className="text-lg font-semibold">
                            Add a project
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            The home of something big!
                        </p>
                    </div>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={close}>
                        <X />
                    </Button>
                </div>

                <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                    <Field data-invalid={Boolean(form.formState.errors.name)}>
                        <FieldLabel htmlFor="project-name">Name</FieldLabel>
                        <Input
                            id="project-name"
                            placeholder="Vandelay Industries"
                            maxLength={100}
                            autoFocus
                            disabled={createProject.isPending}
                            aria-invalid={Boolean(form.formState.errors.name)}
                            {...form.register("name")}
                        />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>

                    <Field data-invalid={Boolean(form.formState.errors.description)}>
                        <FieldLabel htmlFor="project-description">Description</FieldLabel>
                        <Textarea
                            id="project-description"
                            placeholder="Description about your project..."
                            maxLength={500}
                            disabled={createProject.isPending}
                            aria-invalid={Boolean(form.formState.errors.description)}
                            {...form.register("description")}
                        />
                        <FieldError errors={[form.formState.errors.description]} />
                    </Field>

                    {createProject.isError && (
                        <FieldDescription className="text-destructive">
                            {getErrorMessage(createProject.error, "Could not create the project.")}
                        </FieldDescription>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={close} disabled={createProject.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createProject.isPending}>
                            {createProject.isPending ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
