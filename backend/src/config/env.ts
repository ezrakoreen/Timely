import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("4000"),

    DATABASE_URL: z.string(),

    SUPABASE_JWT_SECRET: z.string(),
    SUPABASE_PROJECT_ID: z.string(),

    FRONTEND_ORIGIN: z.url().optional(),
})

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(z.flattenError(parsed.error), null, 2));
  process.exit(1);
}

const data = parsed.data;

// Export a typed, cleaned env object
export const env = {
  ...data,
  PORT: data.PORT ? Number(data.PORT) : 4000,
};