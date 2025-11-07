// src/modules/reports/reports.validation.ts

import mongoose from "mongoose";
import { z } from "zod";

export const getReportSchema = z
  .object({
    startDate: z
      .string({ error: "startDate is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid startDate format, must be a valid date",
      }),
    endDate: z
      .string({ error: "endDate is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid endDate format, must be a valid date",
      }),
    shopId: z
      .string()
      .optional()
      .refine((val) => !val || mongoose.isValidObjectId(val), {
        message: "Invalid shopId",
      }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "startDate cannot be greater than endDate",
      path: ["endDate"],
    }
  );

export type GetReport = z.infer<typeof getReportSchema>;
