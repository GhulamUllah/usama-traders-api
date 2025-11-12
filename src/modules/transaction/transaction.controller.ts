import { Request, Response, NextFunction } from "express";
import {
  CreateTransaction,
  createTransactionSchema,
  deleteTransactionSchema,
  getAllTransactionsSchema,
  getByIdSchema,
  getTransactionByInvoiceIdSchema,
  getTransactionsSchema,
  payRemainingSchema,
  updateTransactionsSchema,
} from "./transaction.validators";
import { errorResponse, successResponse } from "../../utils/response";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getCustomerTransactions,
  getTransactionById,
  getTransactionByInvoiceId,
  payRemaining,
  returnTransaction,
  updateTransaction,
} from "./transaction.services";
import { AuthRequest } from "../../middleware/auth.middleware";
import { returnTransactionSchema, ReturnTransaction } from "./transaction.validators";


// ✅ Create Transaction (credit/debit)
export const createHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: CreateTransaction = createTransactionSchema.parse(
      req.body,
    );
    const result = await createTransaction(parsedData);
    return successResponse(
      res,
      201,
      "Transaction created successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Update Transaction (credit/debit)
export const updateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = updateTransactionsSchema.parse(
      req.body,
    );
    const result = await updateTransaction(parsedData);
    return successResponse(
      res,
      201,
      "Transaction Updated successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Update Transaction (credit/debit)
export const payRemainingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = payRemainingSchema.parse(
      req.body,
    );
    const result = await payRemaining(parsedData);
    return successResponse(
      res,
      201,
      "Transaction Updated successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Process Transaction Return (Full or Partial)
export const returnHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Validate request body
    const parsedData: ReturnTransaction = returnTransactionSchema.parse(req.body);

    // 2️⃣ Process return
    const result = await returnTransaction(parsedData, req.user);

    // 3️⃣ Send success response
    return successResponse(
      res,
      200,
      "Transaction return processed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


// ✅ Get transaction by ID
export const getByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getByIdSchema.parse(req.params);
    const result = await getTransactionById(parsedData);
    if (!result)
      return errorResponse(
        res,
        404,
        "You are not authorized to access this transaction or it does not exist",
      );
    return successResponse(
      res,
      200,
      "Transaction fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
// ✅ Get transaction by Invoice Number
export const getByInvoiceIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getTransactionByInvoiceIdSchema.parse(req.params);
    const result = await getTransactionByInvoiceId(parsedData);
    if (!result)
      return errorResponse(
        res,
        404,
        "You are not authorized to access this transaction or it does not exist",
      );
    return successResponse(
      res,
      200,
      "Transaction fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get all transactions (admin-level)
export const findAllHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedQuery = getAllTransactionsSchema.parse(req.query);
    const result = await getAllTransactions(
      parsedQuery,
      (req as any).user.role,
      (req as any).user.id,
    );
    return successResponse(
      res,
      200,
      "Transactions fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get transactions of a specific customer
export const findByCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getTransactionsSchema.parse(req.params);
    const result = await getCustomerTransactions(parsedData);
    return successResponse(
      res,
      200,
      "Customer transactions fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Soft delete a transaction
export const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = deleteTransactionSchema.parse(req.body);
    const result = await deleteTransaction(parsedData);
    return successResponse(
      res,
      200,
      "Transaction deleted successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
