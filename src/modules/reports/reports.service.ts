// src/modules/reports/reports.service.ts

import TransactionModel from "../transaction/transaction.schema";
import mongoose from "mongoose";
import { GetReport } from "./reports.validators";

export const getCustomerSalesReport = async ({
  startDate,
  endDate,
  shopId,
}: GetReport): Promise<any> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const matchStage: any = {
    createdAt: { $gte: start, $lte: end },
    deletedAt: null,
  };

  if (shopId) {
    matchStage.shopId = new mongoose.Types.ObjectId(shopId);
  }

  const report = await TransactionModel.aggregate([
    { $match: matchStage },

    // Fetch customer info
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

    // Explode product list
    { $unwind: "$productsList" },

    // Fetch product info (cost price)
    {
      $lookup: {
        from: "products",
        localField: "productsList.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },

    // Group by customer
    {
      $group: {
        _id: "$customer._id",
        customerName: { $first: "$customer.name" },

        totalSaleAmount: { $sum: "$actualAmount" },
        totalPaidAmount: { $sum: "$paidAmount" },

        totalCostPrice: {
          $sum: {
            $multiply: ["$productInfo.costPrice", "$productsList.quantity"],
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        customerName: 1,
        totalSaleAmount: 1,
        totalPaidAmount: 1,
        totalDebt: { $subtract: ["$totalSaleAmount", "$totalPaidAmount"] },
        totalCostPrice: 1,
        totalProfit: {
          $subtract: ["$totalSaleAmount", "$totalCostPrice"],
        },
      },
    },

    { $sort: { customerName: 1 } },
  ]);

  return report;
};
