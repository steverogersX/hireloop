import type { RequestHandler } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";
import type { ApiHandler, ApiRequest, ApiRes } from "@/types/http";

export function asyncHandler<
  TData = unknown,
  TBody = unknown,
  TQuery = Query,
  TParams = ParamsDictionary,
>(fn: ApiHandler<TData, TBody, TQuery, TParams>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(
      fn(req as unknown as ApiRequest<TBody, TQuery, TParams>, res as ApiRes<TData>, next),
    ).catch(next);
  };
}
