import { and, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users, instructorApplications } from "../db/schema/index.js";
import {
  applicationIdParamSchema,
  applicationStatusQuerySchema,
} from "../validations/instructorApplication.validation.js";

// Student: apply to become an instructor
export const applyForInstructor = async (req, res) => {
  const { expertise, bio } = req.body;

  const pendingApplication = await db.query.instructorApplications.findFirst({
    where: { userId: req.user.id, status: "pending" },
  });

  if (pendingApplication) {
    return res.status(409).json({
      success: false,
      message: "You already have a pending application",
    });
  }

  const [application] = await db
    .insert(instructorApplications)
    .values({ userId: req.user.id, expertise, bio })
    .returning();

  return res.status(201).json({ success: true, data: application });
};

// Admin: list applications (optional ?status=pending)
export const getApplications = async (req, res) => {
  const { status } = applicationStatusQuerySchema.parse(req.query);

  const applications = await db.query.instructorApplications.findMany({
    where: status ? { status } : undefined,
    with: {
      user: { columns:
         { id: true,
            name: true,
            email: true } 
        },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ success: true, data: applications });
};

// Admin: approve -> application approved + user becomes instructor (atomic)
export const approveApplication = async (req, res) => {
  const { id } = applicationIdParamSchema.parse(req.params);

  const result = await db.transaction(async (tx) => {
    const [application] = await tx
      .update(instructorApplications)
      .set({
        status: "approved",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      })
      .where(
        and(
          eq(instructorApplications.id, id),
          eq(instructorApplications.status, "pending")
        )
      )
      .returning();

    if (!application) return null;

    await tx
      .update(users)
      .set({ role: "instructor" })
      .where(and(eq(users.id, application.userId), eq(users.role, "student")));

    return application;
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Pending application not found",
    });
  }

  return res.json({ success: true, data: result });
};

// Admin: reject
export const rejectApplication = async (req, res) => {
  const { id } = applicationIdParamSchema.parse(req.params);

  const [application] = await db
    .update(instructorApplications)
    .set({
      status: "rejected",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    })
    .where(
      and(
        eq(instructorApplications.id, id),
        eq(instructorApplications.status, "pending")
      )
    )
    .returning();

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Pending application not found",
    });
  }

  return res.json({ success: true, data: application });
};