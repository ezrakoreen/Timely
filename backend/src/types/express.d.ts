// src/types/express.d.ts
import type { JwtPayload } from "jose";

declare global {
  namespace Express {
    interface User extends JwtPayload {
      // Add fields you expect from Supabase JWT
      sub: string;          // user id
      email?: string;
      role?: string;
      // Add others as needed (e.g. "aud", "app_metadata", etc.)
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
