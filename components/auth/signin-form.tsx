"use client"

import { cn } from "cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Google } from "../ui/svgs/google"
import { GithubDark } from "../ui/svgs/githubDark"
import { GithubLight } from "../ui/svgs/githubLight"

const formSchema = z.object({
    email: z
        .email("Please enter a valid email address.")
        .max(100, "Email must be at most 100 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
})

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        const { data, error } = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
            callbackURL: "http://localhost:3000/",
        })

        if (error) {
            toast.error("Unable to sign in", {
                description: error.message,
            })
            return
        }

        toast.success("Signed in successfully", {
            description: data?.user?.email ?? "Welcome back.",
        })
    }

    async function signInWithSocial(provider: "google" | "github") {
        await authClient.signIn.social({
            provider,
            callbackURL: "http://localhost:3000/",
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            Sign in to continue to your account
                        </p>
                    </div>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="signin-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                                    <a className="text-xs underline underline-offset-4" href="#">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    {...field}
                                    id="signin-password"
                                    type="password"
                                    placeholder="*********"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="current-password"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <Button type="submit" form="form-signin">Sign In</Button>
                    </Field>
                    <FieldSeparator>Or continue with</FieldSeparator>
                    <Field orientation="horizontal" className="justify-center">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signInWithSocial("google")}
                        >
                            <Google className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signInWithSocial("github")}
                        >
                            <GithubLight className="mr-2 h-4 w-4 dark:hidden" />
                            <GithubDark className="mr-2 hidden h-4 w-4 dark:block" />
                            Sign in with GitHub
                        </Button>
                    </Field>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account? <a href="/sign-up">Sign up</a>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    )
}
