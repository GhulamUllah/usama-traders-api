import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import UserModel from "../auth/auth.schema";
import CostumerModel from "../customer/customer.schema";
import ShopModel from "../shop/shop.schema";
import ProductModel from "../product/product.schema";
import TransactionModel from "../transaction/transaction.schema";
import { successResponse } from "../../utils/response";
import { currencyFormatter } from "../../utils/helper";

const getStatistics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalUsers = await UserModel.countDocuments({});
    const totalCostumers = await CostumerModel.countDocuments({});
    const totalShops = await ShopModel.countDocuments({});
    const totalProducts = await ProductModel.countDocuments({});
    const transactions = await TransactionModel.countDocuments({});
    const shops = await ShopModel.find({ deletedAt: null }).lean()

    const generalStats = [
      {
        label: "Total Users",
        value: totalUsers,
      },
      {
        label: "Total Costumers",
        value: totalCostumers,
      },
      {
        label: "Total Shops",
        value: totalShops,
      },
      {
        label: "Total Products",
        value: totalProducts,
      },
      {
        label: "Total Orders",
        value: transactions,
      },
    ];
    const shopStats = shops.map(shop=>({
      name:"Shop: "+shop.name,
      stats:[
      {
        label: "Total Products",
        value: shop.totalProducts||0,
      },
      {
        label: "Total Revenue",
        value: currencyFormatter(shop.totalRevenue),
      },
      {
        label: "Total Orders",
        value: shop.totalSales,
      },
    ]
    }))
    return successResponse(res, 200, "Statistics fetched!", {generalStats, shopStats});
  } catch (error) {
    next(error);
  }
};

export default getStatistics;
