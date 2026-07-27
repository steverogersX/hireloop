import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { fromZodError } from "zod-validation-error";
import { ApiError } from "@/utils/ApiError";

type Source = "body" | "query" | "params";

export interface RequestSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

function assign(req: Request, source: Source, value: unknown) {
  Object.defineProperty(req, source, { value, writable: true, configurable: true });
}

export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const source of ["params", "query", "body"] as const) {
      const schema = schemas[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const readable = fromZodError(result.error, { prefix: `Invalid request ${source}` });
        return next(
          ApiError.validation(readable.message, {
            source,
            issues: readable.details.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
              code: issue.code,
            })),
          }),
        );
      }

      assign(req, source, result.data);
    }

    next();
  };
}

export const validateBody = (schema: ZodTypeAny) => validate({ body: schema });
export const validateQuery = (schema: ZodTypeAny) => validate({ query: schema });
export const validateParams = (schema: ZodTypeAny) => validate({ params: schema });
