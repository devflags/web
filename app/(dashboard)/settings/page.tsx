export default function OrganizationSettingsPage() {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Organization settings</h1>
            </header>
            <section className="max-w-2xl rounded-lg border bg-card p-5">
                <h2 className="font-medium">Team</h2>
                <p className="mt-1 text-sm text-muted-foreground">Invite teammates and manage organization access.</p>
                <p className="mt-4 text-xs text-muted-foreground">Team management is not available yet.</p>
            </section>
        </div>
    )
}
