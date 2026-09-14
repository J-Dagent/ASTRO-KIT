/// <reference types="astro/client" />

export {};

declare global {
  namespace Cloudflare {
    interface Env {
      POLAR_SECRET: string;
      POLAR_SERVER?: "sandbox" | "production";
    }
  }
}
