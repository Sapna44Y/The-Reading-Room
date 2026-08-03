import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 8000;
export const MONGO_URI = requireEnv("MONGO_URI");
export const JWT_SECRET = requireEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "36h";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
