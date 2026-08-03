import app from "./app.js";
import { PORT, NODE_ENV } from "./config/env.js";
import connectDB from "./database/connection.js";

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();
