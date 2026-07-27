import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";
import type { ApiResponse } from "@/utils/ApiResponse";

export type ApiRequest<
  TBody = unknown,
  TQuery = Query,
  TParams = ParamsDictionary,
> = Request<TParams, ApiResponse<unknown>, TBody, TQuery>;

export type ApiRes<TData = null> = Response<ApiResponse<TData>>;

export type ApiHandler<TData = unknown, TBody = unknown, TQuery = Query, TParams = ParamsDictionary> = (
  req: ApiRequest<TBody, TQuery, TParams>,
  res: ApiRes<TData>,
  next: NextFunction,
) => Promise<unknown>;

export interface IdParams {
  id: string;
}

export interface SlugParams {
  slug: string;
}
