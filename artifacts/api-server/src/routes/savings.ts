import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { savingsCirclesTable } from "@workspace/db/schema";
import {
  CreateSavingsCircleBody,
  GetSavingsCircleParams,
  AddContributionParams,
  AddContributionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeCircle(row: typeof savingsCirclesTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    goalName: row.goalName,
    goalAmount: row.goalAmount,
    savedAmount: row.savedAmount,
    deadline: row.deadline,
    createdAt: row.createdAt,
  };
}

// ─── GET /savings-circles ─────────────────────────────────────────────────────

router.get("/savings-circles", async (_req, res) => {
  const rows = await db.select().from(savingsCirclesTable).orderBy(savingsCirclesTable.createdAt);
  res.json(rows.map(serializeCircle));
});

// ─── POST /savings-circles ────────────────────────────────────────────────────

router.post("/savings-circles", async (req, res) => {
  const parsed = CreateSavingsCircleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, goalName, goalAmount, deadline } = parsed.data;

  const [row] = await db
    .insert(savingsCirclesTable)
    .values({
      name,
      goalName,
      goalAmount,
      deadline: deadline instanceof Date ? deadline.toISOString().split("T")[0] : String(deadline),
    })
    .returning();

  res.status(201).json(serializeCircle(row!));
});

// ─── GET /savings-circles/:id ─────────────────────────────────────────────────

router.get("/savings-circles/:id", async (req, res) => {
  const params = GetSavingsCircleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(savingsCirclesTable)
    .where(eq(savingsCirclesTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Savings circle not found" });
    return;
  }
  res.json(serializeCircle(row));
});

// ─── PATCH /savings-circles/:id/contribution ─────────────────────────────────

router.patch("/savings-circles/:id/contribution", async (req, res) => {
  const params = AddContributionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = AddContributionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(savingsCirclesTable)
    .where(eq(savingsCirclesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Savings circle not found" });
    return;
  }

  const [updated] = await db
    .update(savingsCirclesTable)
    .set({ savedAmount: existing.savedAmount + body.data.amount })
    .where(eq(savingsCirclesTable.id, params.data.id))
    .returning();

  res.json(serializeCircle(updated!));
});

export default router;
