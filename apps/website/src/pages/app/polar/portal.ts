import type { APIRoute } from "astro";
import { UnauthorizedError } from "@/server/auth";
import { createCustomerPortal } from "@/server/payments";

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    return redirect(await createCustomerPortal(request), 302);
  } catch (error) {
    if (error instanceof UnauthorizedError) return redirect("/app", 302);
    throw error;
  }
};
