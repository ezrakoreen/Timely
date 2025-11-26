import { Router, Request } from "express";
import { prisma } from "../prisma/client.js";
import { updateUserProfileSchema } from "../validation/userProfile.js"
import { validateBody } from "../middleware/validate.js";

interface AuthenticatedRequest extends Request {
  userId: string;
}

const router = Router();

// GET /user-profile/me
// Fetch the current user's profile, creating a default one if it doesn't exist.
router.get("/me", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;

    const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
        },
      });

    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PATCH /user-profile/me
// Update parts of the current user's profile.
router.patch("/me", validateBody(updateUserProfileSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const {
      defaultBufferMin,
      walkingSpeedFactor,
      campusHomeLabel,
      campusHomeLat,
      campusHomeLng,
      notificationsEnabled,
      quietHoursStart,
      quietHoursEnd,
    } = req.body;

    const profile = await prisma.userProfile.update({
      where: { userId },
      data: {
        // Only update fields that are present in the body
        ...(defaultBufferMin !== undefined && { defaultBufferMin }),
        ...(walkingSpeedFactor !== undefined && { walkingSpeedFactor }),
        ...(campusHomeLabel !== undefined && { campusHomeLabel }),
        ...(campusHomeLat !== undefined && { campusHomeLat }),
        ...(campusHomeLng !== undefined && { campusHomeLng }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(quietHoursStart !== undefined && { quietHoursStart }),
        ...(quietHoursEnd !== undefined && { quietHoursEnd }),
      },
    });

    res.json(profile);
  } catch (err) {
    next(err);
  }
});

export default router;
