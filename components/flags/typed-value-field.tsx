import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FeatureFlagType } from "@/lib/api/flags"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function formatFlagValue(type: FeatureFlagType, value: unknown): string {
    if (type === FeatureFlagType.JSON) return JSON.stringify(value === undefined ? {} : value, null, 2)
    if (type === FeatureFlagType.BOOLEAN) return typeof value === "boolean" ? String(value) : "false"
    if (type === FeatureFlagType.NUMBER) return typeof value === "number" ? String(value) : "0"
    return typeof value === "string" ? value : ""
}

export function parseFlagValue(type: FeatureFlagType, value: string): unknown {
    if (type === FeatureFlagType.BOOLEAN) return value === "true"
    if (type === FeatureFlagType.NUMBER) {
        const parsed = Number(value)
        if (!value.trim() || !Number.isFinite(parsed)) throw new Error("Enter a valid number.")
        return parsed
    }
    if (type === FeatureFlagType.JSON) {
        try {
            return JSON.parse(value)
        } catch {
            throw new Error("Enter valid JSON.")
        }
    }
    return value
}

export function TypedValueField({
    type,
    value,
    onChange,
    disabled,
}: {
    type: FeatureFlagType
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}) {
    if (type === FeatureFlagType.BOOLEAN) {
        return (
            <Select value={value} onValueChange={(nextValue) => nextValue && onChange(nextValue)} disabled={disabled}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="false">false</SelectItem>
                    <SelectItem value="true">true</SelectItem>
                </SelectContent>
            </Select>
        )
    }

    if (type === FeatureFlagType.JSON) {
        return <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} spellCheck={false} disabled={disabled} />
    }

    return (
        <Input
            type={type === FeatureFlagType.NUMBER ? "number" : "text"}
            step={type === FeatureFlagType.NUMBER ? "any" : undefined}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
        />
    )
}
