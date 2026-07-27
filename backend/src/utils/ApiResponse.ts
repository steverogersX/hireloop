import type { Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiErrorBody {
  code: string;
  details?: unknown;
}

export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  error?: ApiErrorBody;
  timestamp: string;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function success<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: StatusCodes = StatusCodes.OK,
  meta?: PaginationMeta,
): Response<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    success: true,
    statusCode,
    message: message ?? getReasonPhrase(statusCode),
    data,
    timestamp: new Date().toISOString(),
  };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created<T>(res: Response, data: T, message = "Created") {
  return success(res, data, message, StatusCodes.CREATED);
}

export function paginated<T>(
  res: Response,
  result: Paginated<T>,
  message?: string,
): Response<ApiResponse<T[]>> {
  return success(res, result.items, message, StatusCodes.OK, result.meta);
}

export function noContent(res: Response, message = "No content") {
  return success<null>(res, null, message, StatusCodes.OK);
}

export function failure(
  res: Response,
  statusCode: StatusCodes,
  message: string,
  code: string,
  details?: unknown,
): Response<ApiResponse<null>> {
  const body: ApiResponse<null> = {
    success: false,
    statusCode,
    message: message || getReasonPhrase(statusCode),
    data: null,
    error: { code, details },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}
