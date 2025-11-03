import { Router } from "express";
import {
  createHandler,
  findAllHandler,
  findByCustomerHandler,
  deleteHandler,
  getByIdHandler,
} from "./transaction.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction (credit or debit)
 */
router.post("/create", authenticate, createHandler);

/**
 * @route GET /api/transactions
 * @desc Get all transactions (admin level)
 */
router.get("/history", authenticate, findAllHandler);

/**
 * @route GET /api/transactions/:id
 * @desc Get a transaction by ID
 */
router.get("/:id", authenticate, getByIdHandler);

/**
 * @route GET /api/transactions/customer/:customerId
 * @desc Get all transactions of a specific customer
 */
router.get("/customer/:customerId", authenticate, findByCustomerHandler);

/**
 * @route DELETE /api/transactions
 * @desc Soft delete a transaction
 */
router.delete("/", authenticate, authorizeAdmin, deleteHandler);

export default router;
