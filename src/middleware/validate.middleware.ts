// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodAny, ZodError } from "zod";

export const validate =
  (schema: ZodAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: (error as any).errors.map((err: any) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
