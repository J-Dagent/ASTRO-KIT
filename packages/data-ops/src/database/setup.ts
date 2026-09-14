import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export interface DatabaseConnection {
  host: string;
  username: string;
  password: string;
}

export function createDatabase(connection: DatabaseConnection) {
  const connectionString = `postgres://${connection.username}:${connection.password}@${connection.host}`;
  const client = neon(connectionString);
  return drizzle(client);
}

export type Database = ReturnType<typeof createDatabase>;

let db: Database | undefined;

export function initDatabase(connection: DatabaseConnection) {
  if (db) {
    return db;
  }
  db = createDatabase(connection);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
