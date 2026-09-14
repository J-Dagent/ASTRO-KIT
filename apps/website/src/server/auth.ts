import { env } from "cloudflare:workers";
import { createAuthServer } from "@repo/data-ops/auth/server";
import { createRequestDatabase } from "@/server/database";
import { createPostHogClient } from "@/server/posthog";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export function createRequestAuth(request: Request) {
  const origin = new URL(request.url).origin;

  return createAuthServer({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || origin,
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

export async function getSession(request: Request) {
  return createRequestAuth(request).api.getSession({ headers: request.headers });
}

export async function requireSession(request: Request) {
  const session = await getSession(request);
  if (!session) {
    throw new UnauthorizedError();
  }

  await createPostHogClient().identifyImmediate({
    distinctId: session.user.id,
    properties: {
      email: session.user.email,
      name: session.user.name,
      $set_once: { first_seen: new Date().toISOString() },
    },
  });

  return session;
}
