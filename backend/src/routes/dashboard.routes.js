import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, dashboardController.getStats);

export default router;
