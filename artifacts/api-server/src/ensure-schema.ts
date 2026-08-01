import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

// Deployments provision a Postgres instance but never run migrations, so the
// first request against a fresh database fails with `relation does not exist`.
// Instead of requiring a manual `drizzle-kit push`, ensure the schema exists at
// boot. `CREATE TABLE IF NOT EXISTS` is idempotent and cheap on a cold start.
const TABLE_SQL = [
  `CREATE TABLE IF NOT EXISTS waitlist (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS savings_circles (
    id serial PRIMARY KEY,
    name text NOT NULL,
    goal_name text NOT NULL,
    goal_amount real NOT NULL,
    saved_amount real NOT NULL DEFAULT 0,
    deadline date NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS tribe_profiles (
    id serial PRIMARY KEY,
    name text NOT NULL,
    goal text NOT NULL,
    city text NOT NULL,
    bio text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS ai_query_log (
    id serial PRIMARY KEY,
    endpoint text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
];

export async function ensureSchema(): Promise<void> {
  for (const sql of TABLE_SQL) {
    await pool.query(sql);
  }
  logger.info("Database schema ensured");
}
