"use client"

import { cn } from "cn"
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
import { authClient } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Google } from "../ui/svgs/google"
import { GithubLight } from "../ui/svgs/githubLight"
import { GithubDark } from "../ui/svgs/githubDark"


/* const { data, error } = await authClient.signUp.email({
    name: "John Doe", // required, The name of the user.
    email: "john.doe@example.com", // required, The email address of the user.
    password: "password1234", // required, The password of the user. It should be at least 8 characters long and max 128 by default.
    image: "https://example.com/image.png", // An optional profile image of the user.
    callbackURL: "https://example.com/callback", // An optional URL to redirect to after the user signs up.
}); */

const formSchema = z.object({
    name: z
        .string()
        .min(5, "Name must be at least 5 characters.")
        .max(32, "Name must be at most 32 characters."),
    email: z
        .email("Please enter a valid email address.")
        .max(100, "Email must be at most 100 characters."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(32, "Password must be at most 32 characters.")
        .refine((val) => /[A-Z]/.test(val), {
            message: "Must contain at least one uppercase letter.",
        })
        .refine((val) => /[a-z]/.test(val), {
            message: "Must contain at least one lowercase letter.",
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "Must contain at least one number.",
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: "Must contain at least one special character.",
        }),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
})



export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        // Do something with the form values.
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                    <code>{JSON.stringify(formData, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        })

        const { data, error } = await authClient.signUp.email({
            name: formData.name, // required, The name of the user.
            email: formData.email, // required, The email address of the user.
            password: formData.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
            //image: "https://example.com/image.png", // An optional profile image of the user.
            //callbackURL: "https://example.com/callback", // An optional URL to redirect to after the user signs up.
        })

        if (error) {
            toast.error("Unable to create account", {
                description: error.message,
            })
            return
        }

        toast.success("Account created", {
            description: data?.user?.email ?? "Your account was created successfully.",
        })
    }

    const signInWithGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000/",
        })
    }

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/",
        })
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form id="form-signup" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            Fill in the form below to create your account
                        </p>
                    </div>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="on"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="on"
                                />
                                <FieldDescription>
                                    We&apos;ll use this to contact you. We will not share your email
                                    with anyone else.
                                </FieldDescription>
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
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="*********"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="on"
                                />
                                <FieldDescription>
                                    Must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one number.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                <Input
                                    {...field}
                                    id="confirmPassword"
                                    type="password"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="on"
                                />
                                <FieldDescription>Please confirm your password.</FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <Button type="submit" form="form-signup">Create Account</Button>
                    </Field>
                    <FieldSeparator>Or continue with</FieldSeparator>
                    <Field orientation="horizontal" className="justify-center">
                        <Button variant="outline" type="button" onClick={signInWithGoogle}>
                            <Google className="mr-2 h-4 w-4" />
                            Sign up with Google
                        </Button>
                        <Button variant="outline" type="button" onClick={signInWithGithub}>
                            <GithubLight className="mr-2 h-4 w-4 dark:hidden" />
                            <GithubDark className="mr-2 hidden h-4 w-4 dark:block" />
                            Sign up with GitHub
                        </Button>

                    </Field>
                    <FieldDescription className="px-6 text-center">
                        Already have an account? <a href="/sign-in">Sign in</a>
                    </FieldDescription>
                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div >
    )
}
