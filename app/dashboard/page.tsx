export default function DashboardPage() {
    return (
        <div className="flex min-h-svh flex-col">
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Welcome to your dashboard! Here you can manage your projects,
                    view analytics, and customize your settings. Use the sidebar to
                    navigate through different sections of your dashboard.
                </p>
            </div>
        </div>
    )
}