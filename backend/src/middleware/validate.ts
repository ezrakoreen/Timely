import type { Request, Response, NextFunction } from "express";
import { z, ZodError, type ZodType } from "zod";

type RequestPart = "body" | "query" | "params";

type SchemaMap = Partial<Record<RequestPart, ZodType>>;

export function validateRequest(schemas: SchemaMap) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      (["body", "query", "params"] as RequestPart[]).forEach((key) => {
        const schema = schemas[key];
        if (!schema) return;

        const result = schema.safeParse((req as any)[key]);
        if (!result.success) {
          const zodError = result.error as ZodError;
          return res.status(400).json({
            error: "Validation error",
            target: key,
            issues: zodError.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
              code: issue.code,
            })),
          });
        }

        (req as any)[key] = result.data;
      });

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export function validateBody(schema: z.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        issues: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
}
