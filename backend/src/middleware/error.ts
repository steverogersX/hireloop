import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { ApiError } from "@/utils/ApiError";
import { failure } from "@/utils/ApiResponse";
import { isProd } from "@/config/env";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return failure(res, err.statusCode, err.message, err.code, err.details);
  }

  if (err instanceof ZodError) {
    const readable = fromZodError(err);
    return failure(
      res,
      StatusCodes.UNPROCESSABLE_ENTITY,
      readable.message,
      "VALIDATION_ERROR",
      readable.details,
    );
  }

  if (!isProd) console.error(err);

  const message = err instanceof Error ? err.message : "Internal server error";
  return failure(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    isProd ? "Internal server error" : message,
    "INTERNAL_ERROR",
  );
}
