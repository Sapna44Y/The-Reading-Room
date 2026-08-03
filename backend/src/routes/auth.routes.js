import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
import authSchema from "../validation/auth.schema.js";

const router = express.Router();

router.post("/signup", validate(authSchema.signup), authController.signup);
router.post("/login", validate(authSchema.login), authController.login);
router.post("/logout", authenticate, authController.logout);

export default router;
