import { Users } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"

export default function TeamPage() {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
            </header>
            <div className="flex flex-1">
                <EmptyState icon={Users} title="Team management is coming soon" description="Organization members and invitations will be managed here." />
            </div>
        </div>
    )
}
