import { organizationClient } from "better-auth/client/plugins";
import { organization } from "better-auth/plugins/organization";
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",

    emailAndPassword: {
        enabled: true,
    },


    plugins: [
        organizationClient()
        /*  admin() */
    ],
})