import { Router, Request } from "express";
import { prisma } from "../prisma/client.js";
import { createSnapshotSchema } from "../validation/calendarSnapshot.js";
import { validateBody } from "../middleware/validate.js";

interface AuthenticatedRequest extends Request {
  userId: string;
}

const router = Router();

// GET /calendar-snapshots
// List snapshots for the current user, newest first.
router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const limit = Number(req.query.limit) || 10;

    const snapshots = await prisma.calendarSnapshot.findMany({
      where: { userId },
      orderBy: { capturedAt: "desc" },
      take: limit,
    });

    res.json(snapshots);
  } catch (err) {
    next(err);
  }
});

// GET /calendar-snapshots/latest
// Get the most recent snapshot for the current user.
router.get("/latest", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;

    const snapshot = await prisma.calendarSnapshot.findFirst({
      where: { userId },
      orderBy: { capturedAt: "desc" },
    });

    if (!snapshot) {
      return res.status(404).json({ error: "No snapshots found" });
    }

    res.json(snapshot);
  } catch (err) {
    next(err);
  }
});

// GET /calendar-snapshots/:id
// Fetch a single snapshot by id (only if it belongs to the user).
router.get("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const snapshot = await prisma.calendarSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot || snapshot.userId !== userId) {
      return res.status(404).json({ error: "Snapshot not found" });
    }

    res.json(snapshot);
  } catch (err) {
    next(err);
  }
});

// POST /calendar-snapshots
// Create a new snapshot from normalized events (rolling window).
router.post("/", validateBody(createSnapshotSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { events, capturedAt } = req.body;

    if (!Array.isArray(events)) {
      return res.status(400).json({ error: "`events` must be an array" });
    }

    const snapshot = await prisma.calendarSnapshot.create({
      data: {
        userId,
        eventsJson: events,
        ...(capturedAt && { capturedAt: new Date(capturedAt) }),
      },
    });

    res.status(201).json(snapshot);
  } catch (err) {
    next(err);
  }
});

// DELETE /calendar-snapshots/:id
// Mostly for debugging/admin.
router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Ensure it belongs to this user
    const existing = await prisma.calendarSnapshot.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Snapshot not found" });
    }

    await prisma.calendarSnapshot.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
