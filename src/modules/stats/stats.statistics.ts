import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import UserModel from "../auth/auth.schema";
import CostumerModel from "../customer/customer.schema";
import ShopModel from "../shop/shop.schema";
import ProductModel from "../product/product.schema";
import TransactionModel from "../transaction/transaction.schema";
import { successResponse } from "../../utils/response";
import { currencyFormatter } from "../../utils/helper";
import mongoose from "mongoose";

const getStatistics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.user)
    const isAdmin = (req as any).user.role === "admin";
    const shopQuery: any = { deletedAt: null };
    const transactionQuery: any = { deletedAt: null };
    if (!isAdmin) {
      shopQuery["_id"] = new mongoose.Types.ObjectId((req as any).user.assignedShop);
      transactionQuery["sellerId"] = new mongoose.Types.ObjectId((req as any).user.id);
    }
    let generalStats: any[] = [];
    if (isAdmin) {
      const totalUsers = await UserModel.countDocuments({ deletedAt: null });
      const totalShops = await ShopModel.countDocuments({ deletedAt: null });
      generalStats.push({
        label: "Total Users",
        value: totalUsers,
      },
        {
          label: "Total Shops",
          value: totalShops,
        });
    }
    const totalCostumers = await CostumerModel.countDocuments({ deletedAt: null });
    const totalProducts = await ProductModel.countDocuments({ deletedAt: null });
    const transactions = await TransactionModel.countDocuments(transactionQuery);
    generalStats.push(
      {
        label: "Total Customers",
        value: totalCostumers,
      },
      {
        label: "Total Products",
        value: totalProducts,
      },
      {
        label: "Total Transactions",
        value: transactions,
      }
    );

    const shops = await ShopModel.find(shopQuery).lean();

    const shopStats = shops.map((shop) => ({
      name: "Shop: " + shop.name,
      stats: [
        {
          label: "Total Products",
          value: shop.totalProducts || 0,
        },
        {
          label: "Total Revenue",
          value: currencyFormatter(shop.totalRevenue),
        },
        {
          label: "Total Orders",
          value: shop.totalSales,
        },
      ],
    }));
    return successResponse(res, 200, "Statistics fetched!", {
      generalStats,
      shopStats,
    });
  } catch (error) {
    next(error);
  }
};

export default getStatistics;
