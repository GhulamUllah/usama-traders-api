import { Router } from "express";
import {
  createHandler,
  findAllHandler,
  findByCustomerHandler,
  deleteHandler,
  getByIdHandler,
  returnHandler,
  updateHandler,
  payRemainingHandler,
} from "./transaction.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction (credit or debit)
 */
router.post("/create", authenticate, createHandler);

/**
 * @route POST /api/transactions/update
 * @desc update transaction (credit or debit)
 */
router.post("/update", authenticate, updateHandler);

/**
 * @route POST /api/transactions/pay-remaining
 * @desc update transaction (credit or debit)
 */
router.post("/pay-remaining", authenticate, payRemainingHandler);
/**
 * @route POST /api/transactions
 * @desc Return partial or full transactions
 */
router.post("/return", authenticate, returnHandler);
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
 * @route PATCH /api/transactions/update/:id
 * @desc update a transaction
 */
router.patch("/update/:id", authenticate, findByCustomerHandler);

/**
 * @route DELETE /api/transactions
 * @desc Soft delete a transaction
 */
router.delete("/", authenticate, authorizeAdmin, deleteHandler);

export default router;
