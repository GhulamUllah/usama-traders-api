import mongoose from 'mongoose';
import TransactionModel from './transaction.schema';
import CustomerModel from '../costumer/costumer.schema';
import { CreateTransaction, DeleteTransaction, GetTransactions } from './transaction.validators';
import { TransactionResponse } from './transaction.types';

// ✅ Get all transactions (optional filters later)
export const getAllTransactions = async (): Promise<any> => {
  const transactions = await TransactionModel.find()
    .populate('customerId', 'name phoneNumber')
    .populate('performer', 'name email')
    .sort({ createdAt: -1 });

  return { transactions };
};

// ✅ Create transaction + update customer balance atomically
export const createTransaction = async (data: CreateTransaction): Promise<any> => {
  const { customerId, performer, amount, type, description = '' } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create transaction record
    const [transaction] = await TransactionModel.create(
      [
        {
          customerId,
          performer,
          amount,
          type,
          description,
        },
      ],
      { session },
    );

    // 2. Update customer balance
    const balanceChange = type === 'credit' ? amount : -amount;

    const customer = await CustomerModel.findByIdAndUpdate(
      customerId,
      { $inc: { balance: balanceChange } },
      { new: true, session },
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    // 3. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: 'Transaction successful',
      transaction,
      newBalance: customer.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Transaction failed: ' + (error as Error).message);
  }
};

// ✅ Get all transactions of a specific customer
export const getCustomerTransactions = async (data: GetTransactions): Promise<any> => {
  const { customerId } = data;

  const transactions = await TransactionModel.find({ customerId }).sort({ createdAt: -1 });

  return { transactions };
};

// ✅ Soft delete transaction (optional)
export const deleteTransaction = async (data: DeleteTransaction): Promise<TransactionResponse> => {
  const { transactionId } = data;

  const update = await TransactionModel.findByIdAndUpdate(
    transactionId,
    { $set: { deletedAt: new Date() } },
    { new: true },
  );

  if (!update) {
    throw new Error('Unable to delete transaction');
  }

  return {
    message: 'Transaction deleted successfully',
  };
};
