import express from "express"

const router = express.Router();

import { createCourse } from "../controller/course.controller.js";
import { getMyCourses } from "../controller/course.controller.js";
import { getCourseById } from "../controller/course.controller.js";
import { updateCourse } from "../controller/course.controller.js";
import { requireAuth } from "../middleware/requireAuth.js"
import { createCourseSchema } from "../validations/course.validation.js";
import { updateCourseSchema } from "../validations/course.validation.js";
import { deleteCourse } from "../controller/course.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

//  Instructor — Course Management

router.post("/", requireAuth , authorizeRoles("instructor"), validate(createCourseSchema), createCourse);
router.get("/my-courses", requireAuth, authorizeRoles("instructor"), getMyCourses);
router.get("/my-courses/:id", requireAuth, authorizeRoles("instructor") , getCourseById );
router.patch("/my-courses/:id", requireAuth, authorizeRoles("instructor"), validate(updateCourseSchema),updateCourse );
router.delete("/my-courses/:id", requireAuth, authorizeRoles("instructor"), deleteCourse)
/*
Instructor নিজেই course publish করতে পারবে
PATCH /api/courses/:id/publish	Course publish করা
PATCH	/api/courses/:id/unpublish	Course unpublish করে draft করা
PATCH	/api/courses/:id/archive	Course archive করা */


export default router;