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

app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
