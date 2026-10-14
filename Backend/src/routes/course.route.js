import express from "express"

const router = express.Router();

import { createCourse } from "../controller/course.controller.js";
import { requireAuth } from "../middleware/requireAuth.js"
import { createCourseSchema } from "../validations/course.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

/* POST /api/courses

GET /api/courses/my-courses

GET /api/courses

GET /api/courses/:id

PATCH /api/courses/:id

DELETE /api/courses/:id

 */


router.post("/", requireAuth , authorizeRoles(/* "instructor", */ "admin"), validate(createCourseSchema), createCourse);



export default router;