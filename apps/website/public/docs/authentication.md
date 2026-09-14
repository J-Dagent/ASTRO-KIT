# Better Auth Setup
---
## Overview

Better Auth provides a comprehensive authentication solution that works seamlessly with serverless and edge environments. It offers built-in support for multiple authentication strategies including social providers, email/password, and session management.

The authentication system is designed with **database-agnostic architecture** and includes:

- **Social Authentication** - Support for Google, GitHub, Discord, and other OAuth providers
- **Session Management** - Secure token-based sessions with automatic refresh
- **Database Integration** - Works with PostgreSQL, MySQL, and SQLite and other providers through Drizzle ORM
- **Type Safety** - Full TypeScript support with auto-generated schemas
- **Edge Compatible** - Optimized for serverless and edge runtime environments
---

## Step 1: Configure environment variables

Set up the required environment variables for authentication. You'll need a secret key for token signing and OAuth credentials for social authentication providers.

Generate a secure secret key using: `openssl rand -base64 32`

### PostgreSQL Configuration

```bash
# packages/data-ops/.env
# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### MySQL Configuration

```bash
# packages/data-ops/.env
# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Cloudflare D1 Configuration

```bash
# packages/data-ops/.env
# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> **OAuth Setup:** Create OAuth applications in your provider's developer console (e.g., Google Cloud Console) and add the redirect URI: `https://your-domain.com/api/auth/callback/google`

## Step 2: Configure Better Auth CLI

Create the Better Auth configuration for the CLI. This configuration is used by the `better-auth:generate` command to create database schemas and TypeScript types.

Update your `packages/data-ops/config/auth.ts` file based on your database provider. This instance is used exclusively by the Better Auth CLI and should not be used in your application runtime.

### PostgreSQL CLI Configuration

```typescript
// packages/data-ops/config/auth.ts
import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = createBetterAuth({
  database: drizzleAdapter(
    initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    }),
    {
      provider: "pg",
    },
  ),
});
```

### MySQL CLI Configuration

```typescript
// packages/data-ops/config/auth.ts
import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = createBetterAuth({
  database: drizzleAdapter(
    initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    }),
    {
      provider: "mysql",
    },
  ),
});
```

### Cloudflare D1 CLI Configuration

```typescript
// packages/data-ops/config/auth.ts
import { createBetterAuth } from "../src/auth/setup";
import Database from "better-sqlite3";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// For CLI use - uses dummy SQLite database
export const auth = createBetterAuth({
  database: drizzleAdapter(new Database("./config/test.sqlite"), {
    provider: "sqlite",
  }),
});
```

## Step 3: Generate authentication schemas

Use Better Auth CLI to generate the database schemas and TypeScript types. This will create the necessary authentication tables in your database and generate type-safe schema definitions.

### 1. Generate Better Auth schemas

```bash
pnpm run better-auth:generate
```

This creates `packages/data-ops/src/drizzle/auth-schema.ts` with your authentication tables

### 2. Generate Drizzle migrations

```bash
pnpm run drizzle:generate
```

This creates SQL migration files in `packages/data-ops/src/drizzle`

### 3. Run migrations (optional)

```bash
pnpm run drizzle:migrate
```

This automatically applies migrations to create the auth tables

> **Table Filtering:** Auth tables are prefixed with `auth_` and filtered out in `drizzle.config.ts` to prevent conflicts when using `drizzle:pull` for application schemas.


## Step 4: Runtime authentication setup

Astro routes run on Cloudflare without a custom global server entry. Create the database and Better Auth instance explicitly for each request so no route depends on an `init → get` call order.

The reusable factories stay in `@repo/data-ops` and remain framework-agnostic:

```ts
// packages/data-ops/src/database/setup.ts
export function createDatabase(connection: DatabaseConnection) {
  const client = neon(
    `postgres://${connection.username}:${connection.password}@${connection.host}`,
  );
  return drizzle(client);
}

// packages/data-ops/src/auth/server.ts
export function createAuthServer(config: AuthServerConfig) {
  const { adapter, ...authConfig } = config;
  return createBetterAuth({
    database: drizzleAdapter(adapter.drizzleDb, {
      provider: adapter.provider,
      schema,
    }),
    ...authConfig,
  });
}
```

The Astro website maps Cloudflare bindings at the request boundary:

```ts
// apps/website/src/server/auth.ts
export function createRequestAuth(request: Request) {
  return createAuthServer({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || new URL(request.url).origin,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    adapter: {
      drizzleDb: createRequestDatabase(),
      provider: "pg",
    },
  });
}

export function getSession(request: Request) {
  return createRequestAuth(request).api.getSession({ headers: request.headers });
}
```

The starter's active default is Neon/PostgreSQL. The MySQL and D1 sections above remain provider alternatives: adapt the framework-agnostic factory and adapter together when selecting one of them.


## Step 5: API route integration

Astro file-based endpoints export HTTP method handlers. Mount Better Auth on the catch-all route:

```ts
// apps/website/src/pages/api/auth/[...all].ts
import type { APIRoute } from "astro";
import { createRequestAuth } from "@/server/auth";

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  return createRequestAuth(request).handler(request);
};
```

This endpoint handles every request under `/api/auth/*`. It is rendered on demand; marketing and documentation routes remain prerendered.

## Step 6: Client-side integration

Use the Better Auth client to integrate authentication into your React components. The client provides hooks and utilities for managing authentication state and user sessions.

```typescript
// apps/website/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export const { useSession, signIn, signOut } = authClient;

// Usage in components
export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Sign out {session.user.name}
      </button>
    );
  }

  return (
    <button onClick={() => signIn.social({ provider: "google" })}>
      Sign in with Google
    </button>
  );
}
```

---

# Better Auth Client Integration

*Client Guide*

Implement secure authentication on the client side with React hooks

## Overview

The Better Auth React client provides a seamless integration for managing authentication state in your React application. It offers type-safe hooks, automatic session management, and optimized caching for a smooth user experience.

The client-side integration includes:

- **React Hooks** - useSession and other authentication hooks
- **Automatic Session Management** - Handles token refresh and session validation
- **Social Authentication** - Streamlined OAuth flows with redirect handling
- **Route Protection** - Easy implementation of authenticated routes
- **TypeScript Support** - Full type safety for user data and session state

## Step 1: Setting up the Better Auth React Client

Create a Better Auth client instance that communicates with your backend authentication endpoints. This client provides React hooks and methods for managing authentication state throughout your application.

The client automatically handles session management, token refresh, and provides optimized caching for authentication state.

```typescript
// src/components/auth/client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

> **Automatic Configuration:** The client automatically detects the base URL and configures endpoints based on your server setup. For custom configurations, you can pass options like `baseURL` to override defaults.

## Step 2: Implementing Login and Logout Components

Better Auth provides simple methods for social authentication and session management. The login component handles OAuth flows while the logout functionality can be integrated into user account interfaces.

### Google OAuth Login Component

The login component uses `authClient.signIn.social()` to initiate OAuth flows with redirect handling.

```typescript
// src/components/auth/google-login.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "./client";

export function GoogleLogin() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-12 text-base"
            variant="outline"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              {/* Google icon SVG paths */}
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Account Dialog with Logout

The account dialog demonstrates session state management and logout functionality using `useSession` hook.

```typescript
// src/components/auth/account-dialog.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "./client";
import { LogOut, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AccountDialogProps {
  children: React.ReactNode;
}

export function AccountDialog({ children }: AccountDialogProps) {
  const { data: session } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
  };

  if (!session) {
    return null;
  }

  const user = session.user;
  const fallbackText = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <Dialog>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-4">
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-2xl font-semibold">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            {user.name && (
              <div className="text-lg font-semibold">{user.name}</div>
            )}
            {user.email && (
              <div className="text-sm text-muted-foreground">{user.email}</div>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full mt-6">
            <div className="flex items-center justify-between w-full py-3 px-4 rounded-lg border bg-card">
              <span className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </span>
              <ThemeToggle />
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

> **Session Management:** The `useSession` hook automatically manages authentication state, handles token refresh, and provides real-time updates when the session changes.


## Step 3: Protecting routes with server-side sessions

Protected Astro layouts and pages read the session from the incoming request before rendering:

```astro
---
// apps/website/src/layouts/AppLayout.astro
export const prerender = false;
import { getSession } from "@/server/auth";

const session = await getSession(Astro.request);
---
{session ? <slot /> : <LoginIsland client:load />}
```

Routes that must never render protected data should redirect before loading it:

```astro
---
export const prerender = false;
const session = await getSession(Astro.request);
if (!session) return Astro.redirect("/app");
---
```

Astro Actions call the same server helpers. Those helpers use `requireSession(request)`, so invoking an action directly without a session returns an unauthorized error. Keep authentication server-side for all protected data and payment operations; use the Better Auth React client only for interactive login, logout, and account UI.
