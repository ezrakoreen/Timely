// src/routes/eventSnapshot.ts
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";
import { validateRequest } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

const router = Router();

/**
 * Zod schemas
 */

// GET /api/event-snapshots?date=2025-11-24 (optional)
const listEventsSchema = {
  query: z.object({
    // Optional filter; adjust/extend as needed
    date: z.string().optional(),
  }),
};

// POST /api/event-snapshots
const createEventSchema = {
  body: z.object({
    externalId: z.string().min(1),        // e.g. Google Calendar event ID
    title: z.string().min(1),
    startTime: z.iso.datetime({offset: true}),     // ISO strings
    endTime: z.iso.datetime({offset: true}),
    location: z.string().min(1),
    // add any other fields you have in your Prisma model
  }),
};

// DELETE /api/event-snapshots/:id
const deleteEventSchema = {
  params: z.object({
    id: z.string().min(1), // use .uuid() if your ids are UUIDs
  }),
};

/**
 * Routes
 */

// List events for the authenticated user
router.get(
  "/",
  requireAuth,
  validateRequest(listEventsSchema),
  async (req, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError("Unauthorized", 401, "UNAUTHENTICATED");
      }

      const { date } = req.query as z.infer<typeof listEventsSchema["query"]>;

      const events = await prisma.eventSnapshot.findMany({
        where: {
          userId: req.user.sub,
          ...(date ? { date } : {}),
        },
        orderBy: { startTime: "asc" },
      });

      res.json({ events });
    } catch (err) {
      next(err);
    }
  }
);

// Create an event snapshot
router.post(
  "/",
  requireAuth,
  validateRequest(createEventSchema),
  async (req, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError("Unauthorized", 401, "UNAUTHENTICATED");
      }

      const body = req.body as z.infer<typeof createEventSchema["body"]>;

      const event = await prisma.eventSnapshot.create({
        data: {
          userId: req.user.sub,
          externalId: body.externalId,
          title: body.title,
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
          location: body.location,
          // map any extra fields here
        },
      });

      res.status(201).json({ event });
    } catch (err) {
      next(err);
    }
  }
);

// Delete an event snapshot by id
router.delete(
  "/:id",
  requireAuth,
  validateRequest(deleteEventSchema),
  async (req, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError("Unauthorized", 401, "UNAUTHENTICATED");
      }

      const { id } = req.params as z.infer<
        typeof deleteEventSchema["params"]
      >;

      // Optional: ensure it belongs to this user
      const existing = await prisma.eventSnapshot.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== req.user.sub) {
        throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
      }

      await prisma.eventSnapshot.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
