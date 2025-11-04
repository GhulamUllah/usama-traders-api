import mongoose from "mongoose";
import TransactionModel from "./transaction.schema";
import CustomerModel from "../customer/customer.schema";
import {
  CreateTransaction,
  DeleteTransaction,
  GetAllTransactionsQuery,
  GetTransactionById,
  GetTransactions,
} from "./transaction.validators";
import { TransactionResponse } from "./transaction.types";
import ShopModel from "../shop/shop.schema";
import ProductModel from "../product/product.schema";
import {
  getCountsPipeline,
  getFilteredTransactions,
} from "./transaction.pipelines";

// ✅ Get all transactions (optional filters later)
export const getAllTransactions = async (
  data: GetAllTransactionsQuery,
  role: string,
  userId: string,
): Promise<any> => {
  const { page = 1, limit = 10, search } = data;

  const matchStage: any = {};
  if (role === "user")
    matchStage["sellerId._id"] = new mongoose.Types.ObjectId(userId);

  if (search) {
    matchStage.$or = [
      { "customerId.name": { $regex: search, $options: "i" } },
      { "sellerId.name": { $regex: search, $options: "i" } },
      { "shopId.name": { $regex: search, $options: "i" } },
    ];
  }
  const transactions = await TransactionModel.aggregate(
    getFilteredTransactions(matchStage, page, limit),
  );

  // Total count for pagination
  const countPipeline = getCountsPipeline(matchStage);
  const countResult = await TransactionModel.aggregate(countPipeline);
  const totalRecords = countResult[0]?.totalRecords || 0;

  return {
    data: transactions,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
    currentPage: page,
  };
};

// ✅ Get transaction by ID
export const getTransactionById = async (
  data: GetTransactionById,
  userId: string,
): Promise<any> => {
  const transaction = await TransactionModel.findOne({
    _id: data.id,
    sellerId: new mongoose.Types.ObjectId(userId),
  })
    .populate("customerId")
    .populate("sellerId", "name -_id")
    .populate("shopId", "name -_id")
    .sort({ createdAt: -1 });

  return transaction;
};

/**
 * Create a new transaction (Atomic + Type-safe)
 */
export const createTransaction = async (
  data: CreateTransaction,
): Promise<any> => {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const {
        customerId,
        sellerId,
        shopId,
        productsList,
        flatDiscount = 0,
        paidAmount = 0,
        useBalance = false,
      } = data;

      // Fetch references
      const customer =
        await CustomerModel.findById(customerId).session(session);
      const shop = await ShopModel.findById(shopId).session(session);
      if (!customer) throw new Error("Customer not found");
      if (!shop) throw new Error("Shop not found");

      // Fetch products
      const productIds = productsList.map((p) => p.productId);
      const dbProducts = await ProductModel.find({
        _id: { $in: productIds },
      }).lean();
      if (dbProducts.length !== productsList.length)
        throw new Error("One or more products not found");

      // Compute totals
      let subtotal = 0;
      let totalDiscount = 0;

      const finalProducts = productsList.map((p) => {
        const dbProd = dbProducts.find(
          (d) => d._id.toString() === p.productId.toString(),
        );
        if (!dbProd) throw new Error(`Product ${p.productId} not found`);
        const quantity = p.quantity || 1;
        subtotal += dbProd.price * quantity;
        totalDiscount += (dbProd.discount || 0) * quantity;
        return {
          productId: dbProd._id,
          price: dbProd.price,
          quantity,
          name: dbProd.name,
        };
      });

      const taxableAmount = Math.max(
        0,
        subtotal - totalDiscount - flatDiscount,
      );
      const taxRate = shop.taxRate || 0;
      const tax = (taxRate / 100) * taxableAmount;
      const actualAmount = taxableAmount + tax;

      const previousBalance = customer.balance || 0;
      const hasPositiveBalance = previousBalance > 0;

      let paidThroughAccountBalance = 0;
      let paidThroughCash = paidAmount;
      let currentBalance = previousBalance;

      if (useBalance && hasPositiveBalance) {
        paidThroughAccountBalance = Math.min(previousBalance, actualAmount);
        paidThroughCash = Math.max(0, paidAmount - paidThroughAccountBalance);
        currentBalance = previousBalance - paidThroughAccountBalance;
      }

      const totalPaid = paidThroughCash + paidThroughAccountBalance;
      const paymentType = totalPaid >= actualAmount ? "FULL" : "PARTIAL";

      const [transaction] = await TransactionModel.create(
        [
          {
            customerId,
            sellerId,
            shopId,
            actualAmount,
            productsList: finalProducts,
            paidAmount: totalPaid,
            flatDiscount,
            totalDiscount,
            tax,
            paidThroughCash,
            paidThroughAccountBalance,
            paymentType,
            previousBalance,
            currentBalance,
          },
        ],
        { session },
      );

      const newBalance = currentBalance + (totalPaid - actualAmount);

      await Promise.all([
        CustomerModel.findByIdAndUpdate(
          customerId,
          {
            $set: { balance: newBalance },
            $inc: { totalSpent: totalPaid, totalOrders: 1 },
          },
          { session },
        ),
        ShopModel.findByIdAndUpdate(
          shopId,
          { $inc: { totalSales: 1, totalRevenue: actualAmount } },
          { session },
        ),
        ...finalProducts.map((p) =>
          ProductModel.findByIdAndUpdate(
            p.productId,
            { $inc: { inStock: -p.quantity } },
            { session },
          ),
        ),
      ]);

      return {
        message: "Transaction recorded successfully",
        transaction,
        calculated: {
          subtotal,
          totalDiscount,
          tax,
          actualAmount,
          paymentType,
          paidThroughCash,
          paidThroughAccountBalance,
          previousBalance,
          currentBalance: newBalance,
        },
      };
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Transaction failed: " + (error as Error).message);
  } finally {
    session.endSession();
  }
};

// ✅ Get all transactions of a specific customer
export const getCustomerTransactions = async (
  data: GetTransactions,
): Promise<any> => {
  const { customerId } = data;

  const transactions = await TransactionModel.find({ customerId }).sort({
    createdAt: -1,
  });

  return { transactions };
};

// ✅ Soft delete transaction (optional)
export const deleteTransaction = async (
  data: DeleteTransaction,
): Promise<TransactionResponse> => {
  const { transactionId } = data;

  const update = await TransactionModel.findByIdAndUpdate(
    transactionId,
    { $set: { deletedAt: new Date() } },
    { new: true },
  );

  if (!update) {
    throw new Error("Unable to delete transaction");
  }

  return {
    message: "Transaction deleted successfully",
  };
};
