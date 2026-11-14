"use client"

import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useCreateFlag, { useUpdateFlag } from "@/hooks/flags/mutations"
import { useDebounce } from "@/hooks/use-debounce"
import { FeatureFlagType, type Flag } from "@/lib/api/flags"
import { getErrorMessage } from "@/lib/errors"
import { createFlagSchema, toFlagKey, CreateFlagFormValues } from "@/lib/validations/flags"

type CreateFlagDialogProps = {
    projectId: string
    open: boolean
    onOpenChange: (open: boolean) => void
    flag?: Flag
}

const flagTypes = [
    { value: FeatureFlagType.BOOLEAN, label: "Boolean", description: "On or off" },
    { value: FeatureFlagType.STRING, label: "String", description: "Text value" },
    { value: FeatureFlagType.NUMBER, label: "Number", description: "Numeric value" },
    { value: FeatureFlagType.JSON, label: "JSON", description: "Structured value" },
] as const

export function CreateFlagDialog({
    projectId,
    open,
    onOpenChange,
    flag,
}: CreateFlagDialogProps) {
    const isEditing = Boolean(flag)
    const createFlag = useCreateFlag(projectId)
    const updateFlag = useUpdateFlag(projectId, flag?.id ?? "")
    const form = useForm<CreateFlagFormValues>({
        resolver: zodResolver(createFlagSchema),
        defaultValues: {
            name: "",
            key: "",
            description: "",
            type: FeatureFlagType.BOOLEAN,
        },
    })
    const name = useWatch({ control: form.control, name: "name" })
    const debouncedName = useDebounce(name, 100)
    const { reset: resetForm, setValue } = form
    const mutation = isEditing ? updateFlag : createFlag
    const { reset: resetMutation, isPending, isError, error } = mutation
    const flagName = flag?.name
    const flagKey = flag?.key
    const flagDescription = flag?.description
    const flagType = flag?.type

    useEffect(() => {
        if (open) {
            resetForm(isEditing
                ? {
                    name: flagName ?? "",
                    key: flagKey ?? "",
                    description: flagDescription ?? "",
                    type: flagType ?? FeatureFlagType.BOOLEAN,
                }
                : {
                    name: "",
                    key: "",
                    description: "",
                    type: FeatureFlagType.BOOLEAN,
                })
            resetMutation()
        }
    }, [flag?.id, flagDescription, flagKey, flagName, flagType, isEditing, open, resetForm, resetMutation])

    useEffect(() => {
        if (!isEditing) {
            setValue("key", toFlagKey(debouncedName), { shouldValidate: true })
        }
    }, [debouncedName, isEditing, setValue])

    function close() {
        if (isPending) return
        onOpenChange(false)
        resetForm()
        resetMutation()
    }

    function onSubmit(values: CreateFlagFormValues) {
        mutation.mutate(
            { ...values, description: values.description || undefined },
            { onSuccess: close },
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) close()
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit feature flag" : "Create a feature flag"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the details for this feature flag."
                            : "Define the flag details now. You can configure its values per environment later."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="form-create-flag"
                    className="min-w-0"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-create-flag-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-create-flag-name"
                                        placeholder="New checkout flow"
                                        autoComplete="off"
                                        autoFocus
                                        maxLength={32}
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldDescription>
                                        Use a descriptive name that your team will recognize.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-create-flag-type">Type</FieldLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value)}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger
                                                id="form-create-flag-type"
                                                className="w-full"
                                                aria-invalid={fieldState.invalid}
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {flagTypes.map((flagType) => (
                                                    <SelectItem key={flagType.value} value={flagType.value}>
                                                        <span>{flagType.label}</span>
                                                        <span className="text-muted-foreground">
                                                            {flagType.description}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="key"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-create-flag-key">Key</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-create-flag-key"
                                            readOnly={!isEditing}
                                            tabIndex={isEditing ? undefined : -1}
                                            className="bg-muted/50 font-mono text-sm"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldDescription>
                                            {isEditing ? "Use lowercase letters, numbers, hyphens, and underscores." : "Generated from the name."}
                                        </FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-create-flag-description">
                                        Description
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-create-flag-description"
                                            placeholder="Describe what this flag controls and when to enable it."
                                            rows={6}
                                            maxLength={500}
                                            className="min-h-24 resize-none"
                                            disabled={isPending}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field?.value?.length || 0}/500
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {isError && (
                            <FieldDescription className="text-destructive">
                                {getErrorMessage(error, `Could not ${isEditing ? "update" : "create"} the feature flag.`)}
                            </FieldDescription>
                        )}
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={close} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="form-create-flag" disabled={isPending}>
                        {isPending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save changes" : "Create flag")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
