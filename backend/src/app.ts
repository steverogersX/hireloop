import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env, isProd } from "@/config/env";
import { errorHandler, notFoundHandler } from "@/middleware/error";
import { apiRouter } from "@/routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(isProd ? "combined" : "dev"));
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 300 }));

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
