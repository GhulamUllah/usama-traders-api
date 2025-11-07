// src/modules/reports/reports.controller.ts

import { Request, Response } from "express";
import { getCustomerSalesReport } from "./reports.service";
import { getReportSchema } from "./reports.validators";

export const getSalesReportController = async (req: Request, res: Response) => {
  try {
    const parsed = getReportSchema.parse(req.query);

    const report = await getCustomerSalesReport(parsed);

    return res.status(200).json({
      message: "Report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Validation Failed",
      error: (error as Error).message,
    });
  }
};
