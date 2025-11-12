import mongoose from "mongoose";
import TransactionModel from "./transaction.schema";
import CustomerModel from "../customer/customer.schema";
import {
  CreateTransaction,
  DeleteTransaction,
  GetAllTransactionsQuery,
  GetTransactionById,
  GetTransactions,
  PayRemaining,
  UpdateTransaction,
} from "./transaction.validators";
import { TransactionResponse } from "./transaction.types";
import ShopModel from "../shop/shop.schema";
import ProductModel from "../product/product.schema";
import {
  getCountsPipeline,
  getFilteredTransactions,
} from "./transaction.pipelines";
import SalesmanModel from "../salesman/salesman.schema";

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
  const transaction = await TransactionModel.findById(data.id)
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
        salesmanId,
      } = data;

      // Fetch references
      const customer =
        await CustomerModel.findById(customerId).session(session);
      const shop = await ShopModel.findById(shopId).session(session);
      let salesman = null;
      if (salesmanId) salesman = await SalesmanModel.findById(salesmanId).session(session)

      if (!customer) throw new Error("Customer not found");
      if (!shop) throw new Error("Shop not found");
      if (salesmanId && !salesman) throw new Error("Salesman not found");

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
          retail: dbProd.retail,
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
        salesmanId ? SalesmanModel.findByIdAndUpdate(
          salesmanId,
          { $inc: { totalOrders: 1 } },
          { session }
        ) : Promise.resolve()
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

/**
 * Update transaction (Atomic + Type-safe)
 */
export const updateTransaction = async (data: UpdateTransaction): Promise<any> => {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const { transactionId, debt = [] } = data;

      if (!Array.isArray(debt) || debt.length === 0) {
        // nothing to push — return early (or you may still want to return existing tx)
        const tx = await TransactionModel.findById(transactionId).session(session);
        if (!tx) throw new Error("Transaction not found");
        return { message: "No debt to add", transaction: tx };
      }

      // 1) Load existing transaction (to get shopId, customerId)
      const existingTx = await TransactionModel.findById(transactionId).session(session);
      if (!existingTx) throw new Error("Transaction not found");

      // 2) Compute sum of incoming debt amounts (treat missing amount as 0)
      const newDebtSum = debt.reduce((s: number, d: any) => s + (Number(d?.amount) || 0), 0);
      if (newDebtSum === 0) {
        // still push records if amounts are zero — but no financial effect
      }

      // 3) Push new debt entries into transaction.debt
      const updatedTx = await TransactionModel.findByIdAndUpdate(
        transactionId,
        { $push: { debt: { $each: debt } } },
        { new: true, session },
      );

      // 4) Apply financial adjustments: subtract newDebtSum from shop.totalRevenue and customer.balance
      // Use existingTx.shopId and existingTx.customerId
      const shopUpdate = ShopModel.findByIdAndUpdate(
        existingTx.shopId,
        { $inc: { totalRevenue: -newDebtSum } },
        { session },
      );
      const customerUpdate = CustomerModel.findByIdAndUpdate(
        existingTx.customerId,
        { $inc: { balance: -newDebtSum } },
        { session },
      );

      await Promise.all([shopUpdate, customerUpdate]);

      return {
        message: "Debt appended and balances adjusted",
        transaction: updatedTx,
        calculated: {
          pushedDebtSum: newDebtSum,
        },
      };
    });
  } catch (error) {
    console.error("Transaction debt append failed:", error);
    throw new Error("Transaction debt append failed: " + (error as Error).message);
  } finally {
    session.endSession();
  }
};

export const payRemaining = async (data: PayRemaining): Promise<any> => {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const { transactionId, debtId } = data;

      // 1️⃣ Validate input
      if (!transactionId || !debtId) {
        throw new Error("transactionId and debtId are required");
      }

      // 2️⃣ Find transaction with selected debt entry
      const transaction = await TransactionModel.findById(transactionId).session(session);
      if (!transaction) throw new Error("Transaction not found");

      const targetDebt = transaction.debt.id(debtId);
      if (!targetDebt) throw new Error("Debt record not found");

      if (targetDebt.status === "Paid") {
        return { message: "This debt is already paid", transaction };
      }

      // 3️⃣ Update the debt status and paid date
      targetDebt.status = "Paid";
      targetDebt.paidAt = new Date();

      await transaction.save({ session });

      // 4️⃣ Calculate payment amount
      const paidAmount = Number(targetDebt.amount) || 0;

      // 5️⃣ Financial updates:
      // Increase shop.totalRevenue by paidAmount
      // Decrease customer.balance by paidAmount
      await Promise.all([
        ShopModel.findByIdAndUpdate(
          transaction.shopId,
          { $inc: { totalRevenue: paidAmount } },
          { session },
        ),
        CustomerModel.findByIdAndUpdate(
          transaction.customerId,
          { $inc: { balance: paidAmount } },
          { session },
        ),
      ]);

      // 6️⃣ Return updated data
      return {
        message: "Debt payment successful",
        transaction,
        paidAmount,
        updatedDebt: targetDebt,
      };
    });
  } catch (error) {
    console.error("Transaction debt payment failed:", error);
    throw new Error("Transaction debt payment failed: " + (error as Error).message);
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
