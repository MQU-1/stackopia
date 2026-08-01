import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db/schema";
import { JoinWaitlistBody, JoinWaitlistResponse } from "@workspace/api-zod";
import { waitlistRateLimit } from "../middlewares/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ─── POST /waitlist ───────────────────────────────────────────────────────────

router.post("/waitlist", waitlistRateLimit, async (req, res) => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, website } = parsed.data;

  // Honeypot: if a bot filled the hidden field, silently accept so it
  // can't learn it's being filtered — but never persist the submission.
  if (website) {
    logger.info("Honeypot caught waitlist bot");
    res.status(201).json({
      id: -1,
      email,
      createdAt: new Date().toISOString(),
    });
    return;
  }

  try {
    const [row] = await db
      .insert(waitlistTable)
      .values({ email })
      .onConflictDoNothing()
      .returning();

    // Already on the list — return the existing entry (idempotent, no leak).
    if (!row) {
      const [existing] = await db
        .select()
        .from(waitlistTable)
        .where(eq(waitlistTable.email, email));

      const data = JoinWaitlistResponse.parse({
        id: existing?.id ?? -1,
        email,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      });
      res.status(201).json(data);
      return;
    }

    const data = JoinWaitlistResponse.parse(row);
    res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Failed to add waitlist entry");
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
