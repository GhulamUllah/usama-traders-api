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
  const aggregation = [
    { $match: matchStage },
    {
      $addFields: {
        totalCost: {
          $sum: {
            $map: {
              input: "$productsList",
              as: "p",
              in: {
                $multiply: [
                  {
                    $toDouble: "$$p.retail"
                  },
                  {
                    $toDouble: "$$p.quantity"
                  }
                ]
              }
            }
          }
        },
        totalAmount: {
          $sum: {
            $map: {
              input: "$productsList",
              as: "p",
              in: {
                $multiply: [
                  {
                    $subtract: [
                      {
                        $toDouble: "$$p.price"
                      },
                      {
                        $toDouble: "$$p.discount"
                      }
                    ]
                  },
                  {
                    $toDouble: "$$p.quantity"
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$customerId",
        totalSale: {
          $sum: {
            $toDouble: "$actualAmount"
          }
        },
        totalPaid: {
          $sum: {
            $toDouble: "$paidAmount"
          }
        },
        // Sum cost and amount across customer orders
        totalCost: {
          $sum: "$totalCost"
        },
        totalGrossAmount: {
          $sum: "$totalAmount"
        }
      }
    },
    {
      $addFields: {
        debt: {
          $subtract: [
            "$totalSale",
            "$totalPaid"
          ]
        },
        profit: {
          $subtract: ["$totalSale", "$totalCost"]
        }
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer"
      }
    },
    {
      $unwind: "$customer"
    },
    {
      $project: {
        _id: 0,
        customerName: "$customer.name",
        totalSaleAmount: "$totalSale",
        totalPaidAmount: "$totalPaid",
        totalDebt: "$debt",
        totalCostPrice: 1,
        totalProfit: "$profit",
      },
    },

    { $sort: { customerName: 1 } },
  ]

  const report = await TransactionModel.aggregate(aggregation as any);

  return report;
};
