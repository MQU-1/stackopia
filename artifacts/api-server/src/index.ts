import app from "./app";
import { pool } from "@workspace/db";
import { ensureSchema } from "./ensure-schema";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

if (!process.env["DATABASE_URL"]) {
  throw new Error(
    "DATABASE_URL environment variable is required but was not provided.",
  );
}

const missingAiKey = !process.env["ANTHROPIC_API_KEY"];
if (missingAiKey) {
  logger.warn("ANTHROPIC_API_KEY is not set — AI endpoints will return 503.");
}

async function main() {
  try {
    await pool.query("SELECT 1");
    await ensureSchema();
  } catch (err) {
    logger.error({ err }, "Database is not reachable or schema init failed");
    throw err;
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
