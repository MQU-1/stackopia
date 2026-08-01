import { rateLimit } from "express-rate-limit";

// AI endpoints call a paid model — be strict about how often a single client
// can invoke them so the API key can't be drained by abuse.
export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI requests — try again in a moment." },
});

// Mutations and the waitlist must not be spammed.
export const mutationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — slow down." },
});

export const waitlistRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many sign-up attempts — try again shortly." },
});
