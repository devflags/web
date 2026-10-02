type ProjectPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="border-b pb-6">
                <p className="text-sm text-muted-foreground">Project</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Project overview
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage the settings and resources for this project.
                </p>
            </header>

            <section className="pt-6">
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <p className="text-sm text-muted-foreground">Project ID</p>
                    <p className="mt-1 break-all font-mono text-sm">{id}</p>
                </div>
            </section>
        </div>
    )
}
