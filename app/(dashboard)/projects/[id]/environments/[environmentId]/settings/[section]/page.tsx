import { ProjectSettingsPage } from "@/components/settings/project-settings-page"

const settingsSections = ["api-keys", "updates", "project"] as const

export default async function SettingsSectionPage({ params }: PageProps<"/projects/[id]/environments/[environmentId]/settings/[section]">) {
    const { section } = await params
    const selectedSection = settingsSections.find((item) => item === section)

    if (!selectedSection) {
        return <ProjectSettingsPage />
    }

    return <ProjectSettingsPage section={selectedSection} />
}
