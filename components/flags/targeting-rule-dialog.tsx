"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { TypedValueField, formatFlagValue, parseFlagValue } from "@/components/flags/typed-value-field"
import { FeatureFlagType, RuleOperator, type TargetingRule, type TargetingRulePayload } from "@/lib/api/flags"
import { getErrorMessage } from "@/lib/errors"

type EditableCondition = { attribute: string; operator: RuleOperator; value: string }
const operators = Object.values(RuleOperator)

function conditionValueToInput(value: unknown) {
    if (Array.isArray(value)) return value.join(", ")
    if (typeof value === "object" && value !== null) return JSON.stringify(value)
    return value === null || value === undefined ? "" : String(value)
}

function parseConditionValue(operator: RuleOperator, value: string): unknown {
    if (operator === RuleOperator.IN || operator === RuleOperator.NOT_IN) {
        return value.split(",").map((part) => part.trim()).filter(Boolean)
    }
    const numericOperators: RuleOperator[] = [RuleOperator.GREATER_THAN, RuleOperator.LESS_THAN, RuleOperator.GREATER_THAN_OR_EQUAL, RuleOperator.LESS_THAN_OR_EQUAL]
    if (numericOperators.includes(operator)) {
        const parsed = Number(value)
        if (!value.trim() || !Number.isFinite(parsed)) throw new Error("Enter a valid number for this comparison.")
        return parsed
    }
    return value
}

export function TargetingRuleDialog({
    open,
    rule,
    flagType,
    isSaving,
    error,
    onOpenChange,
    onSave,
}: {
    open: boolean
    rule?: TargetingRule
    flagType: FeatureFlagType
    isSaving: boolean
    error?: unknown
    onOpenChange: (open: boolean) => void
    onSave: (payload: TargetingRulePayload) => Promise<void>
}) {
    const [priority, setPriority] = useState(() => String(rule?.priority ?? 0))
    const [percentage, setPercentage] = useState(() => rule?.percentage == null ? "" : String(rule.percentage))
    const [returnValue, setReturnValue] = useState(() => formatFlagValue(flagType, rule?.value))
    const [conditions, setConditions] = useState<EditableCondition[]>(() => rule?.conditions.length
        ? rule.conditions.map(({ attribute, operator, value }) => ({ attribute, operator, value: conditionValueToInput(value) }))
        : [{ attribute: "", operator: RuleOperator.EQUALS, value: "" }])
    const [validationError, setValidationError] = useState<string>()

    const save = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setValidationError(undefined)
        try {
            const parsedPriority = Number(priority)
            if (!Number.isInteger(parsedPriority) || parsedPriority < 0) throw new Error("Priority must be a non-negative integer.")
            const parsedPercentage = percentage.trim() ? Number(percentage) : null
            if (parsedPercentage !== null && (!Number.isInteger(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100)) {
                throw new Error("Rollout must be a whole percentage between 0 and 100.")
            }
            if (conditions.some((condition) => !condition.attribute.trim() || !condition.value.trim())) {
                throw new Error("Complete every condition before saving.")
            }
            const payload: TargetingRulePayload = {
                priority: parsedPriority,
                percentage: parsedPercentage,
                value: parseFlagValue(flagType, returnValue),
                conditions: conditions.map((condition) => ({
                    attribute: condition.attribute.trim(),
                    operator: condition.operator,
                    value: parseConditionValue(condition.operator, condition.value),
                })),
            }
            await onSave(payload)
            onOpenChange(false)
        } catch (saveError) {
            setValidationError(saveError instanceof Error ? saveError.message : "Unable to save this rule.")
        }
    }

    const errorMessage = validationError ?? (error ? getErrorMessage(error, "Unable to save this rule.") : undefined)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{rule ? "Edit targeting rule" : "Add targeting rule"}</DialogTitle>
                    <DialogDescription>Rules are evaluated in priority order for this environment. All conditions must match.</DialogDescription>
                </DialogHeader>
                <form className="space-y-5" onSubmit={(event) => void save(event)}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="rule-priority">Priority</FieldLabel>
                            <Input id="rule-priority" type="number" min="0" step="1" value={priority} onChange={(event) => setPriority(event.target.value)} />
                            <FieldDescription>Lower numbers run first.</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="rule-percentage">Rollout percentage</FieldLabel>
                            <Input id="rule-percentage" type="number" min="0" max="100" step="1" value={percentage} onChange={(event) => setPercentage(event.target.value)} placeholder="100% (all matching users)" />
                            <FieldDescription>Optional. Leave empty to include everyone who matches.</FieldDescription>
                        </Field>
                    </div>

                    <section className="space-y-3 rounded-lg border p-4">
                        <div>
                            <h3 className="text-sm font-medium">Conditions</h3>
                            <p className="mt-1 text-xs text-muted-foreground">Every condition below must match the evaluation context.</p>
                        </div>
                        {conditions.map((condition, index) => (
                            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.25fr_1fr_auto]">
                                <Input aria-label={`Condition ${index + 1} attribute`} value={condition.attribute} onChange={(event) => setConditions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, attribute: event.target.value } : item))} placeholder="Attribute (e.g. plan)" />
                                <Select value={condition.operator} onValueChange={(value) => value && setConditions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, operator: value as RuleOperator } : item))}>
                                    <SelectTrigger className="w-full" aria-label={`Condition ${index + 1} operator`}><SelectValue /></SelectTrigger>
                                    <SelectContent>{operators.map((operator) => <SelectItem key={operator} value={operator}>{operator.toLowerCase().replaceAll("_", " ")}</SelectItem>)}</SelectContent>
                                </Select>
                                <Input aria-label={`Condition ${index + 1} value`} value={condition.value} onChange={(event) => setConditions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder={condition.operator === RuleOperator.IN || condition.operator === RuleOperator.NOT_IN ? "value1, value2" : "Value"} />
                                <Button type="button" variant="ghost" size="icon" aria-label={`Remove condition ${index + 1}`} disabled={conditions.length === 1} onClick={() => setConditions((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => setConditions((items) => [...items, { attribute: "", operator: RuleOperator.EQUALS, value: "" }])}><Plus /> Add condition</Button>
                    </section>

                    <Field>
                        <FieldLabel>Return value ({flagType.toLowerCase()})</FieldLabel>
                        {flagType === FeatureFlagType.JSON ? (
                            <Textarea value={returnValue} onChange={(event) => setReturnValue(event.target.value)} rows={4} spellCheck={false} />
                        ) : (
                            <TypedValueField type={flagType} value={returnValue} onChange={setReturnValue} />
                        )}
                        <FieldDescription>Returned when all conditions match and the user is included in the rollout.</FieldDescription>
                    </Field>

                    {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : rule ? "Save rule" : "Add rule"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
