import { createBetterAuth } from "@/auth/setup";
import type { Database } from "@/database/setup";
import {
  auth_account,
  auth_session,
  auth_verification,
  auth_user,
} from "@/drizzle/auth-schema";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export interface AuthServerConfig {
  secret?: Parameters<typeof createBetterAuth>[0]["secret"];
  baseURL?: string;
  socialProviders?: Parameters<typeof createBetterAuth>[0]["socialProviders"];
  adapter: {
    drizzleDb: Database;
    provider: Parameters<typeof drizzleAdapter>[1]["provider"];
  };
}

export function createAuthServer(config: AuthServerConfig) {
  const { adapter, ...authConfig } = config;
  return createBetterAuth({
    database: drizzleAdapter(adapter.drizzleDb, {
      provider: adapter.provider,
      schema: {
        auth_user,
        auth_account,
        auth_session,
        auth_verification,
      },
    }),
    ...authConfig,
  });
}

let betterAuth: ReturnType<typeof createAuthServer> | undefined;

export function setAuth(config: AuthServerConfig) {
  betterAuth = createAuthServer(config);
  return betterAuth;
}

export function getAuth() {
  if (!betterAuth) {
    throw new Error("Auth not initialized");
  }
  return betterAuth;
}
