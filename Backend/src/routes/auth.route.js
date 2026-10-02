import express from "express";
import { signup } from "../controller/auth.controller.js";
import {login} from "../controller/auth.controller.js";
import{logout} from "../controller/auth.controller.js";
import {refreshToken} from "../controller/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema } from "../validations/auth.validation.js";
import { loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout );
router.post("/refresh-token", refreshToken);



export default router;