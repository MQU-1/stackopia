import { pgTable, serial, text, real, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistTable).omit({
  id: true,
  createdAt: true,
});

export type InsertWaitlist = typeof waitlistTable.$inferInsert;
export type WaitlistEntry = typeof waitlistTable.$inferSelect;

// ─── Savings Circles ─────────────────────────────────────────────────────────

export const savingsCirclesTable = pgTable("savings_circles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goalName: text("goal_name").notNull(),
  goalAmount: real("goal_amount").notNull(),
  savedAmount: real("saved_amount").notNull().default(0),
  deadline: date("deadline").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSavingsCircleSchema = createInsertSchema(savingsCirclesTable).omit({
  id: true,
  savedAmount: true,
  createdAt: true,
});

export type InsertSavingsCircle = typeof savingsCirclesTable.$inferInsert;
export type SavingsCircle = typeof savingsCirclesTable.$inferSelect;

// ─── Tribe Profiles ───────────────────────────────────────────────────────────

export const tribeProfilesTable = pgTable("tribe_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  city: text("city").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTribeProfileSchema = createInsertSchema(tribeProfilesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertTribeProfile = typeof tribeProfilesTable.$inferInsert;
export type TribeProfile = typeof tribeProfilesTable.$inferSelect;

// ─── AI query log (for dashboard aiQueriesToday counter) ─────────────────────

export const aiQueryLogTable = pgTable("ai_query_log", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(), // 'spend-rate' | 'invest-plan' | 'price-hunt'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
