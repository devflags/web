"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowUpRight, Plus, Settings2, Trash2 } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CreateFlagDialog } from "@/components/flags/create-flag-dialog"
import { TargetingRuleDialog } from "@/components/flags/targeting-rule-dialog"
import { formatFlagValue, parseFlagValue, TypedValueField } from "@/components/flags/typed-value-field"
import { useGetEnvironments } from "@/hooks/environments/queries"
import { useDeleteTargetingRule, useSaveTargetingRule, useUpdateFlagEnvironment } from "@/hooks/flags/mutations"
import { useGetFlag, useGetFlagEnvironment } from "@/hooks/flags/queries"
import { type FeatureFlagType, type FlagEnvironmentConfiguration, type TargetingRule, type TargetingRulePayload, type UpdateFlagEnvironmentPayload } from "@/lib/api/flags"
import { getErrorMessage } from "@/lib/errors"

export default function FlagConfigurationPage() {
    const { id: projectId, environmentId, flagId } = useParams<{ id: string; environmentId: string; flagId: string }>()
    const { data: flag, isLoading: isFlagLoading, isError: isFlagError, error: flagError } = useGetFlag(projectId, flagId)
    const { data: environments = [], isLoading: isEnvironmentsLoading } = useGetEnvironments(projectId)
    const environment = environments.find((item) => item.id === environmentId)
    const { data: configuration, isLoading: isConfigurationLoading, isError: isConfigurationError, error: configurationError } = useGetFlagEnvironment(projectId, flagId, environmentId)
    const updateConfiguration = useUpdateFlagEnvironment(projectId, flagId, environmentId)
    const saveRule = useSaveTargetingRule(projectId, flagId, environmentId)
    const deleteRule = useDeleteTargetingRule(projectId, flagId, environmentId)

    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<TargetingRule>()

    const openNewRule = () => {
        setEditingRule(undefined)
        saveRule.reset()
        setIsRuleDialogOpen(true)
    }

    const openEditRule = (rule: TargetingRule) => {
        setEditingRule(rule)
        saveRule.reset()
        setIsRuleDialogOpen(true)
    }

    const saveTargetingRule = async (payload: TargetingRulePayload) => {
        await saveRule.mutateAsync({ ruleId: editingRule?.id, payload })
    }

    const removeRule = (ruleId: string) => {
        if (window.confirm("Delete this targeting rule?")) deleteRule.mutate(ruleId)
    }

    const heading = isFlagLoading ? "Flag" : flag?.name ?? "Flag"

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Button nativeButton={false} variant="ghost" size="icon" aria-label="Back to flags" render={<Link href={`/projects/${projectId}/environments/${environmentId}/flags`} />}>
                        <ArrowLeft />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-semibold tracking-tight">{heading}</h1>
                        {flag && <p className="mt-1 truncate font-mono text-sm text-muted-foreground">{flag.key}</p>}
                    </div>
                </div>
                {flag && <Button variant="outline" onClick={() => setIsDetailsOpen(true)}><Settings2 /> Edit details</Button>}
            </header>

            {isFlagLoading || isEnvironmentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading flag configuration…</p>
            ) : isFlagError ? (
                <p role="alert" className="text-sm text-destructive">{getErrorMessage(flagError, "Unable to load this flag.")}</p>
            ) : !flag ? (
                <p className="text-sm text-destructive">This flag could not be found.</p>
            ) : !environments.length ? (
                <section className="rounded-lg border p-6">
                    <h2 className="font-medium">Add an environment first</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Targeting rules are configured separately for each environment.</p>
                    <Button nativeButton={false} className="mt-4" variant="outline" render={<Link href={`/projects/${projectId}/environments/new`} />}>Manage environments <ArrowUpRight /></Button>
                </section>
            ) : isConfigurationLoading ? (
                <p className="text-sm text-muted-foreground">Loading {environment?.name ?? "environment"} settings…</p>
            ) : isConfigurationError || !configuration ? (
                <div role="alert" className="space-y-2 text-sm text-destructive">
                    <p>{getErrorMessage(configurationError, "This flag has no configuration in the selected environment yet.")}</p>
                    <p>Choose another environment from the navigation bar or create the flag configuration first.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <EnvironmentConfigurationForm
                        key={configuration.id}
                        configuration={configuration}
                        flagType={flag.type}
                        environmentName={environment?.name ?? "Environment"}
                        isSaving={updateConfiguration.isPending}
                        error={updateConfiguration.error}
                        onSave={(payload) => updateConfiguration.mutateAsync(payload).then(() => undefined)}
                    />

                    <section className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">Targeting rules</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Rules and returned values are isolated to {environment?.name ?? "this environment"}.</p>
                            </div>
                            <Button onClick={openNewRule}><Plus /> Add rule</Button>
                        </div>

                        {configuration.rules.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-8 text-center">
                                <h3 className="font-medium">No targeting rules yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Matching users will receive the environment default value.</p>
                                <Button className="mt-4" variant="outline" onClick={openNewRule}><Plus /> Add the first rule</Button>
                            </div>
                        ) : (
                            <ol className="space-y-3">
                                {configuration.rules.map((rule, index) => (
                                    <li key={rule.id} className="rounded-xl border bg-card p-4 sm:p-5">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1 space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">Priority {rule.priority}</span>
                                                    <span className="text-xs text-muted-foreground">Rule {index + 1}</span>
                                                    {rule.percentage !== null && <span className="rounded-md bg-muted px-2 py-1 text-xs">{rule.percentage}% rollout</span>}
                                                </div>
                                                <div className="space-y-1">
                                                    {rule.conditions.map((condition) => (
                                                        <p key={condition.id} className="break-words text-sm">
                                                            <code className="rounded bg-muted px-1.5 py-0.5">{condition.attribute}</code>{" "}
                                                            <span className="text-muted-foreground">{condition.operator.toLowerCase().replaceAll("_", " ")}</span>{" "}
                                                            <code className="rounded bg-muted px-1.5 py-0.5">{Array.isArray(condition.value) ? condition.value.join(", ") : String(condition.value)}</code>
                                                        </p>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-muted-foreground">Return value: <code className="break-all text-foreground">{formatFlagValue(flag.type, rule.value)}</code></p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditRule(rule)}>Edit</Button>
                                                <Button variant="ghost" size="icon-sm" aria-label={`Delete rule ${index + 1}`} disabled={deleteRule.isPending} onClick={() => removeRule(rule.id)}><Trash2 /></Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                        {deleteRule.isError && <p role="alert" className="text-sm text-destructive">{getErrorMessage(deleteRule.error, "Unable to delete this rule.")}</p>}
                    </section>
                </div>
            )}

            {flag && <CreateFlagDialog projectId={projectId} open={isDetailsOpen} flag={flag} onOpenChange={setIsDetailsOpen} />}
            {flag && isRuleDialogOpen && (
                <TargetingRuleDialog
                    key={`${environmentId}-${editingRule?.id ?? "new"}`}
                    open
                    rule={editingRule}
                    flagType={flag.type}
                    isSaving={saveRule.isPending}
                    error={saveRule.error}
                    onOpenChange={(open) => {
                        setIsRuleDialogOpen(open)
                        if (!open) setEditingRule(undefined)
                    }}
                    onSave={saveTargetingRule}
                />
            )}
        </div>
    )
}

function EnvironmentConfigurationForm({
    configuration,
    flagType,
    environmentName,
    isSaving,
    error,
    onSave,
}: {
    configuration: FlagEnvironmentConfiguration
    flagType: FeatureFlagType
    environmentName: string
    isSaving: boolean
    error: unknown
    onSave: (payload: UpdateFlagEnvironmentPayload) => Promise<void>
}) {
    const [enabled, setEnabled] = useState(configuration.enabled)
    const [defaultValue, setDefaultValue] = useState(() => formatFlagValue(flagType, configuration.defaultValue))
    const [validationError, setValidationError] = useState<string>()

    const save = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setValidationError(undefined)
        try {
            await onSave({ enabled, defaultValue: parseFlagValue(flagType, defaultValue) })
        } catch (saveError) {
            setValidationError(getErrorMessage(saveError, "Unable to save environment configuration."))
        }
    }

    const errorMessage = validationError ?? (error ? getErrorMessage(error, "Unable to save this configuration.") : undefined)

    return (
        <section className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{environmentName} configuration</h2>
                    <p className="mt-1 text-sm text-muted-foreground">This state and default value are only used in this environment.</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="size-4 accent-primary" />
                    Enabled
                </label>
            </div>
            <form onSubmit={(event) => void save(event)} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Default value <span className="text-muted-foreground">({flagType.toLowerCase()})</span></label>
                    <TypedValueField type={flagType} value={defaultValue} onChange={setDefaultValue} disabled={isSaving} />
                </div>
                <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save configuration"}</Button>
            </form>
            {errorMessage && <p role="alert" className="mt-3 text-sm text-destructive">{errorMessage}</p>}
        </section>
    )
}
