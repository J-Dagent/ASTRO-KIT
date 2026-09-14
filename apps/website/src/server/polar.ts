import { env } from "cloudflare:workers";
import { Polar } from "@polar-sh/sdk";
import { getPolarServer } from "@/lib/polar";

export function createPolarClient() {
  return new Polar({
    accessToken: env.POLAR_SECRET,
    server: getPolarServer(env.POLAR_SERVER),
  });
}
