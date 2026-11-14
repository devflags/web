type ProjectPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <header className="mb-8 flex min-h-10 items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            </header>

            <section>
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                    <p className="text-sm text-muted-foreground">Project ID</p>
                    <p className="mt-1 break-all font-mono text-sm">{id}</p>
                </div>
            </section>
        </div>
    )
}
