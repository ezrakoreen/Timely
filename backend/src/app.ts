import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import userRouter from "./routes/user.js";
import { requireAuth } from "./middleware/auth.js"

const app = express();

// If running behind a proxy (Render, Fly, Nginx, etc.)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Logging (less noisy in test)
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

// CORS: restrict in prod if you have a known frontend origin
app.use(
  cors({
    origin:
      env.NODE_ENV === "production" && env.FRONTEND_ORIGIN
        ? env.FRONTEND_ORIGIN
        : "*",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Basic rate limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/users", requireAuth, userRouter);

export default app;
