# DevFlags Web

The web dashboard for DevFlags, a side project for teams managing feature flags for TypeScript applications.
This application is intended to provide the human-facing experience around the platform: users should be able to sign in, manage organizations and projects, create environments, and configure feature flags without editing them directly through an API.

## Current status
This project is a work in progress and is **not production-ready**. Authentication screens, the dashboard shell, and the first project-management flows are in place. Feature flag management, environment configuration, targeting rules, analytics, and the complete integration with the API are still being built.

Progress is intermittent because this is a side project developed alongside school and work. The UI and API contracts may change while the platform takes shape.
## Technology

- [Next.js](https://nextjs.org/) with the App Router
- React and TypeScript
- [React Query](https://tanstack.com/query/latest) for server state
- [Better Auth](https://www.better-auth.com/) for authentication
- Tailwind CSS and the local UI components

## Local setup
From this directory, install dependencies:

```bash
pnpm install
```
Configure the local API URL and authentication settings expected by the application, then start the development server:

```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in a browser. The API must also be running for authenticated data flows such as loading and creating projects.

## Useful commands
```bash
pnpm run dev       # Start the development server
pnpm run build     # Create a production build
pnpm run start     # Run the production build
pnpm run lint      # Run ESLint
```
## Planned work

- Finish the project, environment, and feature flag workflows
- Add flag editing, typed values, targeting rules, and rollout controls
- Connect the dashboard to the SDK evaluation model
- Improve loading, error, empty, and permission states
- Add tests and document deployment configuration

## Note

DevFlags Web is currently an evolving prototype. It shows the direction of the management dashboard, but it should not yet be treated as a complete product interface.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
