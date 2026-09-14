import type { APIRoute } from "astro";
import { createRequestAuth } from "@/server/auth";

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  return createRequestAuth(request).handler(request);
};
