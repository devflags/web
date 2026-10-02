import { SignupForm } from "@/components/auth/signup-form"
import { ModeToggle } from "@/components/mode-toggle"

export default function SignupPage() {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
                <ModeToggle />
            </div>
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    )
}
