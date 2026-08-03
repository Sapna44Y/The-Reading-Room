import express from "express";
import cors from "cors";
import helmet from "helmet";
import { CORS_ORIGIN } from "./config/env.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
const router = express.Router();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

router.use("/api/auth", authRoutes);
router.use("/api/books", bookRoutes);
router.use("/api/dashboard", dashboardRoutes);

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
