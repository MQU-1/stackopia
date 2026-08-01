import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import path from "node:path";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Requests arrive behind Replit's reverse proxy, so the request's socket
// address is not the client's. Express needs to trust the proxy's
// X-Forwarded-For header for rate limiting and logging to be meaningful.
const TRUST_PROXY_HOPS = Number(process.env.TRUST_PROXY_HOPS ?? "1");
app.set("trust proxy", TRUST_PROXY_HOPS);

app.use(
  helmet({
    // CSP is delivered via the SPA's own meta tag (it must allow the app's
    // scripts, fonts, and styles); a `default-src 'none'` HTTP header here
    // would break the frontend when both are served from this server.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS is locked to an explicit allowlist. Configure `CORS_ALLOWED_ORIGINS`
// (comma-separated) for production. Common local dev origins are allowed by
// default so the Vite dev server can reach the API without a proxy.
const DEV_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5173",
];

const ALLOWED_ORIGINS = [
  ...(process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.NODE_ENV === "production" ? [] : DEV_ALLOWED_ORIGINS),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS policy"));
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  }),
);

// Coarse global limit, then stricter per-route limits for expensive/mutable
// endpoints. `keyGenerator` falls back to the proxy-aware client IP.
const clientIp = (req: express.Request) =>
  (req.ip ?? req.socket?.remoteAddress ?? "unknown").replace(/^::ffff:/, "");

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: clientIp,
    handler(_req, res) {
      res.status(429).json({ error: "Too many requests — slow down." });
    },
  }),
);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "8kb" }));

app.use("/api", router);

// JSON 404 for unknown API routes (never the HTML "Cannot GET" page).
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Optional: serve the built SPA from the API server so a single Replit
// process can serve both the frontend and the API on one port.
const PUBLIC_DIR = process.env.PUBLIC_DIR;
if (PUBLIC_DIR && existsSync(path.resolve(PUBLIC_DIR, "index.html"))) {
  const publicDir = path.resolve(PUBLIC_DIR);
  app.use(express.static(publicDir, { index: false, maxAge: "1d" }));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
  logger.info({ publicDir }, "Serving static frontend");
}

// Central error handler — never leak internals to clients.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message === "Origin not allowed by CORS policy") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    logger.error({ err }, "Unhandled request error");
    res.status(500).json({ error: "Something went wrong" });
  },
);

export default app;
