import { NextRequest, NextResponse } from "next/server"

const sessionCookieNames = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
]

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    if (
        pathname.startsWith("/_next/") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/.well-known/") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/icons/")
    ) {
        return NextResponse.next()
    }

    const hasSessionCookie = sessionCookieNames.some((name) =>
        request.cookies.has(name),
    )
    const isAuthRoute = ["/sign-in", "/sign-up"].includes(
        request.nextUrl.pathname,
    )

    if (isAuthRoute) {
        return hasSessionCookie
            ? NextResponse.redirect(new URL("/", request.url))
            : NextResponse.next()
    }

    if (!hasSessionCookie) {
        const signInUrl = new URL("/sign-in", request.url)
        signInUrl.searchParams.set(
            "callbackUrl",
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
        )

        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/onboarding/:path*",
        "/sign-in",
        "/sign-up",
    ],
}
