import { env } from "cloudflare:workers";
import { PostHog } from "posthog-node";

export function createPostHogClient(): PostHog {
  return new PostHog(env.POSTHOG_API_KEY, {
    host: env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  });
}
