"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

function toSlug(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export default function OrganizationOnboardingPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const organizationName = name.trim()
        const slug = toSlug(organizationName)

        if (!organizationName || !slug) {
            toast.error("Enter a valid organization name")
            return
        }

        setIsSubmitting(true)
        const { data, error } = await authClient.organization.create({
            name: organizationName,
            slug,
        })

        if (error || !data) {
            toast.error("Unable to create organization", {
                description: error?.message,
            })
            setIsSubmitting(false)
            return
        }

        const { error: activeError } =
            await authClient.organization.setActive({
                organizationId: data.id,
            })

        if (activeError) {
            toast.error("Unable to activate organization", {
                description: activeError.message,
            })
            setIsSubmitting(false)
            return
        }

        router.replace("/")
    }

    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md flex-col gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold">
                        Create your organization
                    </h1>
                    <p className="text-muted-foreground">
                        Create an organization to start using DevFlags.
                    </p>
                </div>
                <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Acme Inc."
                    disabled={isSubmitting}
                    required
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create organization"}
                </Button>
            </form>
        </main>
    )
}
