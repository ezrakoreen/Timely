import { Router, Request } from "express";
import { prisma } from "../prisma/client.js";
import { createWalkSegmentSchema, updateWalkSegmentSchema } from "../validation/walkSegment.js"
import { validateBody } from "../middleware/validate.js";


interface AuthenticatedRequest extends Request {
  userId: string;
}

const router = Router();

// GET /walk-segments/upcoming
// Upcoming scheduled walk segments for the current user.
router.get("/upcoming", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const now = new Date();

    const segments = await prisma.walkSegment.findMany({
      where: {
        userId,
        status: "scheduled",
        departureTime: { gte: now },
      },
      orderBy: { departureTime: "asc" },
    });

    res.json(segments);
  } catch (err) {
    next(err);
  }
});

// GET /walk-segments/:id
router.get("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const segment = await prisma.walkSegment.findUnique({ where: { id } });

    if (!segment || segment.userId !== userId) {
      return res.status(404).json({ error: "Walk segment not found" });
    }

    res.json(segment);
  } catch (err) {
    next(err);
  }
});

// POST /walk-segments
// Create a new walk segment. In practice this will usually be called by your
// backend logic after computing ETA from Maps.
router.post("/", validateBody(createWalkSegmentSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const {
      calendarEventId,
      snapshotId,
      departureTime,
      arrivalTime,
      etaMinutes,
      bufferMinutes,
      originLabel,
      originLat,
      originLng,
      destinationLabel,
      destinationLat,
      destinationLng,
      status,
    } = req.body;

    if (!calendarEventId || !snapshotId || !departureTime || !arrivalTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const segment = await prisma.walkSegment.create({
      data: {
        userId,
        calendarEventId,
        snapshotId,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        etaMinutes,
        bufferMinutes,
        originLabel,
        originLat,
        originLng,
        destinationLabel,
        destinationLat,
        destinationLng,
        status: status ?? "scheduled",
      },
    });

    res.status(201).json(segment);
  } catch (err) {
    next(err);
  }
});

// PATCH /walk-segments/:id
// Update status or timing (e.g. cancel, mark as sent, adjust).
router.patch("/:id", validateBody(updateWalkSegmentSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const {
      status,
      departureTime,
      arrivalTime,
      etaMinutes,
      bufferMinutes,
    } = req.body;

    const existing = await prisma.walkSegment.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Walk segment not found" });
    }

    const updated = await prisma.walkSegment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(departureTime && { departureTime: new Date(departureTime) }),
        ...(arrivalTime && { arrivalTime: new Date(arrivalTime) }),
        ...(etaMinutes !== undefined && { etaMinutes }),
        ...(bufferMinutes !== undefined && { bufferMinutes }),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /walk-segments/:id
router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const existing = await prisma.walkSegment.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Walk segment not found" });
    }

    await prisma.walkSegment.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
