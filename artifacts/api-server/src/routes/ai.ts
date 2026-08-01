import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@workspace/db";
import { aiQueryLogTable } from "@workspace/db/schema";
import {
  RateSpendBody,
  RateSpendResponse,
  GetInvestPlanBody,
  GetInvestPlanResponse,
  HuntPricesBody,
  HuntPricesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

async function logQuery(endpoint: string) {
  await db.insert(aiQueryLogTable).values({ endpoint });
}

// ─── POST /ai/spend-rate ─────────────────────────────────────────────────────

router.post("/ai/spend-rate", async (req, res) => {
  const parsed = RateSpendBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { item, amount, context } = parsed.data;

  const prompt = `You are a brutally honest financial coach for a Jordanian user.

A user bought "${item}" for ${amount} JD.${context ? ` Context: ${context}` : ""}

Rate this purchase from 1 (terrible financial decision) to 10 (excellent investment). Consider value for money, need vs want, and financial health.

Respond ONLY with valid JSON matching this exact shape — no markdown, no explanation:
{
  "score": <integer 1-10>,
  "verdict": "<4-6 word label like 'Great Investment' or 'Unnecessary Splurge'>",
  "insight": "<2 honest sentences explaining why, referencing Amman/Jordan context where relevant>"
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected AI response format" });
      return;
    }

    const raw = JSON.parse(block.text.trim());
    const result = RateSpendResponse.parse(raw);
    await logQuery("spend-rate");
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI error";
    res.status(500).json({ error: msg });
  }
});

// ─── POST /ai/invest-plan ─────────────────────────────────────────────────────

router.post("/ai/invest-plan", async (req, res) => {
  const parsed = GetInvestPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { amount, risk } = parsed.data;

  const riskLabels: Record<string, string> = {
    safe: "conservative / capital-preservation",
    balanced: "balanced growth and safety",
    growth: "aggressive growth",
    halal: "Sharia-compliant / halal",
  };

  const prompt = `You are an investment advisor specialising in the Jordanian market.

A user wants to invest ${amount} JD with a ${riskLabels[risk]} risk appetite.

Give a concrete allocation plan. Return ONLY valid JSON — no markdown:
{
  "summary": "<2 sentences: overall strategy and why it suits this risk level in Jordan>",
  "allocations": [
    { "label": "<asset class>", "percent": <number summing to 100>, "color": "<hex colour>" },
    ...
  ],
  "advice": "<2-3 sentences: practical next steps for a Jordanian investor, mention specific platforms or banks if relevant>"
}

Use 3-6 allocation segments. Colours must be distinct and visually appealing. Percents must sum to exactly 100.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected AI response format" });
      return;
    }

    const raw = JSON.parse(block.text.trim());
    const result = GetInvestPlanResponse.parse(raw);
    await logQuery("invest-plan");
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI error";
    res.status(500).json({ error: msg });
  }
});

// ─── POST /ai/price-hunt ──────────────────────────────────────────────────────

router.post("/ai/price-hunt", async (req, res) => {
  const parsed = HuntPricesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { query } = parsed.data;

  const prompt = `You are a price-comparison expert who knows Amman's retail landscape and online shopping well.

The user is looking for: "${query}"

Give realistic, useful price comparisons across physical stores in Amman and online options. Return ONLY valid JSON:
{
  "title": "<product name cleaned up>",
  "stores": [
    {
      "name": "<store or platform name>",
      "type": "<e.g. Local Tech Store / Online / Hypermarket / Specialty Shop>",
      "note": "<one helpful note: availability, condition, return policy, etc.>",
      "price": <price in JD as a number>
    },
    ...
  ],
  "tip": "<1-2 sentence smart buying tip tailored to Amman shoppers>"
}

Include 3-5 store options. Be realistic about JD prices. Favour sources Jordanians actually use (e.g. Virgin Megastore, Jarir Bookstore, Amazon with shipping estimate, local electronics souks).`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected AI response format" });
      return;
    }

    const raw = JSON.parse(block.text.trim());
    const result = HuntPricesResponse.parse(raw);
    await logQuery("price-hunt");
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI error";
    res.status(500).json({ error: msg });
  }
});

export default router;
