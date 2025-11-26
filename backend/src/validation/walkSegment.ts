import { z } from "zod";

export const createWalkSegmentSchema = z.object({
  calendarEventId: z.string(),
  snapshotId: z.string(),

  departureTime: z.string(),
  arrivalTime: z.string(),

  etaMinutes: z.number().int().optional(),
  bufferMinutes: z.number().int().optional(),

  originLabel: z.string().optional(),
  originLat: z.number(),
  originLng: z.number(),

  destinationLabel: z.string().optional(),
  destinationLat: z.number(),
  destinationLng: z.number(),

  status: z.string().optional(),
});

export const updateWalkSegmentSchema = z.object({
  status: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  etaMinutes: z.number().optional(),
  bufferMinutes: z.number().optional(),
});
