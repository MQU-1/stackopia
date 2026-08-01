import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

const TABLE_NAMES = ["waitlist", "savings_circles", "tribe_profiles", "ai_query_log"];

// Public diagnostic endpoint: reports DB connectivity, which tables exist, and
// whether the AI key is configured — without leaking any secret values.
router.get("/diagnostics", async (_req, res) => {
  const db = { connected: false, tables: Object.fromEntries(TABLE_NAMES.map((t) => [t, false])) };
  try {
    await pool.query("SELECT 1");
    db.connected = true;
    for (const name of TABLE_NAMES) {
      const result = await pool.query(
        "SELECT to_regclass($1) IS NOT NULL AS ok",
        [name],
      );
      db.tables[name] = result.rows[0].ok === true;
    }
  } catch {
    // db.connected stays false when the database is unreachable
  }

  res.json({
    status: "ok",
    db,
    ai: { configured: Boolean(process.env["ANTHROPIC_API_KEY"]) },
    port: process.env["PORT"] ?? null,
  });
});

export default router;
