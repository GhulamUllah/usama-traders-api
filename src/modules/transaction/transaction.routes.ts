import { Router } from 'express';
import {
  createHandler,
  findAllHandler,
  findByCustomerHandler,
  deleteHandler,
} from './transaction.controller';

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction (credit or debit)
 */
router.post('/create', createHandler);

/**
 * @route GET /api/transactions
 * @desc Get all transactions (admin level)
 */
router.get('/history', findAllHandler);

/**
 * @route GET /api/transactions/customer/:customerId
 * @desc Get all transactions of a specific customer
 */
router.get('/customer/:customerId', findByCustomerHandler);

/**
 * @route DELETE /api/transactions
 * @desc Soft delete a transaction
 */
router.delete('/', deleteHandler);

export default router;
