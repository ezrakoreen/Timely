import { PrismaClient } from "../generated/client.js";
import { env } from "../config/env.js";

const logLevels: ("query" | "info" | "warn" | "error")[] =
  env.NODE_ENV === "development" ? ["warn", "error"] : ["error"];

// Avoid creating multiple PrismaClients in dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevels,
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}