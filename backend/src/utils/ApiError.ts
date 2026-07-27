import { StatusCodes } from "http-status-codes";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: ApiErrorCode = "INTERNAL_ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, "BAD_REQUEST", details);
  }

  static validation(message = "Validation failed", details?: unknown) {
    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message, "VALIDATION_ERROR", details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(StatusCodes.UNAUTHORIZED, message, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(StatusCodes.FORBIDDEN, message, "FORBIDDEN");
  }

  static notFound(message = "Not found") {
    return new ApiError(StatusCodes.NOT_FOUND, message, "NOT_FOUND");
  }

  static conflict(message = "Conflict") {
    return new ApiError(StatusCodes.CONFLICT, message, "CONFLICT");
  }

  static tooManyRequests(message = "Too many requests") {
    return new ApiError(StatusCodes.TOO_MANY_REQUESTS, message, "TOO_MANY_REQUESTS");
  }

  static internal(message = "Internal server error") {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, "INTERNAL_ERROR");
  }
}
