import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { validate } from "../middleware/validate.middleware.js";
import { applyInstructorSchema } from "../validations/instructorApplication.validation.js";
import {
  applyForInstructor,
  getApplications,
  approveApplication,
  rejectApplication,
} from "../controller/instructorApplication.controller.js";

const router = Router();

router.post("/", requireAuth, authorizeRoles("student"), validate(applyInstructorSchema), applyForInstructor);
router.get("/", requireAuth, authorizeRoles("admin"), getApplications);
router.patch("/:id/approve", requireAuth, authorizeRoles("admin"), approveApplication);
router.patch("/:id/reject", requireAuth, authorizeRoles("admin"), rejectApplication);

export default router;