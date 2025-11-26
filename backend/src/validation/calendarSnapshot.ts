import { z } from "zod";

export const createSnapshotSchema = z.object({
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string().nullable().optional(),
      updated: z.string().optional(),
    })
  ),
  capturedAt: z.string().optional(),
});