import { Response, NextFunction } from "express";
import { AuthRequest } from "./middleware/auth.middleware";
import UserModel from "./modules/auth/auth.schema";
import CostumerModel from "./modules/costumer/costumer.schema";
import ShopModel from "./modules/shop/shop.schema";
import ProductModel from "./modules/product/product.schema";
import TransactionModel from "./modules/transaction/transaction.schema";
import { successResponse } from "./utils/response";


const getStatistics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await UserModel.countDocuments({});
        const totalCostumers = await CostumerModel.countDocuments({});
        const totalShops = await ShopModel.countDocuments({});
        const totalProducts = await ProductModel.countDocuments({});
        const transactions = await TransactionModel.countDocuments({});

        const data = [
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
        return successResponse(res, 200, 'Statistics fetched!', data);
    } catch (error) {
        next(error)
    }
};

export default getStatistics;
