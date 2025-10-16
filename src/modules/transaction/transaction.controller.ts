import { Request, Response, NextFunction } from 'express';
import {
  CreateTransaction,
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
} from './transaction.validators';
import { successResponse } from '../../utils/response';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getCustomerTransactions,
} from './transaction.services';

// ✅ Create Transaction (credit/debit)
export const createHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData: CreateTransaction = createTransactionSchema.parse(req.body);
    const result = await createTransaction(parsedData);
    return successResponse(res, 201, 'Transaction created successfully', result);
  } catch (error) {
    next(error);
  }
};

// ✅ Get all transactions (admin-level)
export const findAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllTransactions();
    return successResponse(res, 200, 'Transactions fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// ✅ Get transactions of a specific customer
export const findByCustomerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = getTransactionsSchema.parse(req.params);
    const result = await getCustomerTransactions(parsedData);
    return successResponse(res, 200, 'Customer transactions fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

// ✅ Soft delete a transaction
export const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = deleteTransactionSchema.parse(req.body);
    const result = await deleteTransaction(parsedData);
    return successResponse(res, 200, 'Transaction deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
