import { Router, type IRouter } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "@workspace/db";
import { tribeProfilesTable } from "@workspace/db/schema";
import {
  CreateTribeProfileBody,
  ListTribesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeProfile(row: typeof tribeProfilesTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    goal: row.goal,
    city: row.city,
    bio: row.bio ?? null,
    createdAt: row.createdAt,
  };
}

// ─── GET /tribes ──────────────────────────────────────────────────────────────

router.get("/tribes", async (req, res) => {
  const queryParsed = ListTribesQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: queryParsed.error.message });
    return;
  }
  const { city, goal } = queryParsed.data;

  let q = db.select().from(tribeProfilesTable).$dynamic();
  if (city) q = q.where(ilike(tribeProfilesTable.city, `%${city}%`));
  if (goal) q = q.where(ilike(tribeProfilesTable.goal, `%${goal}%`));

  const rows = await q.orderBy(tribeProfilesTable.createdAt);
  res.json(rows.map(serializeProfile));
});

// ─── POST /tribes ─────────────────────────────────────────────────────────────

router.post("/tribes", async (req, res) => {
  const parsed = CreateTribeProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(tribeProfilesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(serializeProfile(row!));
});

export default router;
