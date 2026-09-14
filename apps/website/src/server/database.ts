import { env } from "cloudflare:workers";
import { createDatabase } from "@repo/data-ops/database/setup";

export function createRequestDatabase() {
  return createDatabase({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  });
}
