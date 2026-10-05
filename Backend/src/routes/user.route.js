import express from "express";
import { getProfile } from "../controller/user.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfile } from "../controller/user.controller.js";
import { updateProfileSchema } from "../validations/user.validation.js";
import { deleteProfile} from "../controller/user.controller.js";
import { deleteProfileSchema } from "../validations/user.validation.js";


const router = express.Router();

router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, validate(updateProfileSchema), updateProfile);
router.delete("/profile", requireAuth,  validate(deleteProfileSchema) , deleteProfile);

export default router;
