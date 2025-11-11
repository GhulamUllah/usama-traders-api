// src/modules/user/user.validation.ts

import mongoose from "mongoose";
import { z } from "zod";

export const createSalarySchema = z.object({
  description: z.string().trim(),
  amount: z.number(),
  createdFor: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salary ID",
  }),
  createdForModel: z.enum(["Customer", "Salesman"])
});

export const deleteSalarySchema = z.object({
  salaryId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salary ID",
  }),
});

export const updateSalarySchema = z.object({
  salaryId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Business ID",
  }),
  description: z.string().trim(),
});

export type CreateSalaries = z.infer<typeof createSalarySchema>;
export type DeleteSalaries = z.infer<typeof deleteSalarySchema>;
export type UpdateSalaries = z.infer<typeof updateSalarySchema>;
