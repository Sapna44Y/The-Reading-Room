import express from "express";
import bookController from "../controllers/book.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import bookSchema from "../validation/book.schema.js";

const router = express.Router();

router.use(authenticate);

router.get("/", validate(bookSchema.query, "query"), bookController.list);
router.post("/", validate(bookSchema.create), bookController.create);
router.put("/:id", validate(bookSchema.update), bookController.update);
router.delete("/:id", bookController.remove);

export default router;
