import { z } from "zod";

export const updateUserProfileSchema = z.object({
    defaultBufferMin: z.number().int().min(0).optional(),
    walkingSpeedFactor: z.number().min(0.1).max(10).optional(),
    campusHomeLabel: z.string().optional(),
    campusHomeLat: z.number().optional(),
    campusHomeLng: z.number().optional(),
    notificationsEnabled: z.boolean().optional(),
    quietHoursStart: z.string().optional(), // "22:00"
    quietHoursEnd: z.string().optional(),
});