import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { savingsCirclesTable, tribeProfilesTable, aiQueryLogTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/dashboard", async (_req, res) => {
  const [savings] = await db
    .select({
      totalSaved: sql<number>`coalesce(sum(${savingsCirclesTable.savedAmount}), 0)`,
      circleCount: sql<number>`count(*)`,
    })
    .from(savingsCirclesTable);

  const [tribes] = await db
    .select({ tribeCount: sql<number>`count(*)` })
    .from(tribeProfilesTable);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [aiLog] = await db
    .select({ aiQueriesToday: sql<number>`count(*)` })
    .from(aiQueryLogTable)
    .where(sql`${aiQueryLogTable.createdAt} >= ${today}`);

  res.json({
    totalSaved: Number(savings?.totalSaved ?? 0),
    circleCount: Number(savings?.circleCount ?? 0),
    tribeCount: Number(tribes?.tribeCount ?? 0),
    aiQueriesToday: Number(aiLog?.aiQueriesToday ?? 0),
  });
});

export default router;
