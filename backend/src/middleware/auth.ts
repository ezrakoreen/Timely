// src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import { jwtVerify, type JWTPayload } from "jose";
import { env } from "../config/env.js";

const AUTH_HEADER_PREFIX = "Bearer ";

// Supabase usually uses HS256 with the service key / JWT secret
async function verifyToken(token: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
    issuer: `https://${env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1`,
  });

  return payload;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith(AUTH_HEADER_PREFIX)) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.slice(AUTH_HEADER_PREFIX.length).trim();
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const payload = await verifyToken(token);

    // Attach to req.user for downstream handlers
    req.user = {
      ...(payload as any),
    };

    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
