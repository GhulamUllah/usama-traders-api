import { Router } from "express";
import {
  createHandler,
  findAllHandler,
  findByCustomerHandler,
  deleteHandler,
  getByInvoiceIdHandler,
  returnHandler,
  updateHandler,
  payRemainingHandler,
  getByIdHandler,
} from "./transaction.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/pos/sale/create
 * @desc Create a new transaction (credit or debit)
 */
router.post("/create", authenticate, createHandler);

/**
 * @route POST /api/pos/sale/update
 * @desc Update transaction (credit or debit)
 */
router.post("/update", authenticate, updateHandler);

/**
 * @route POST /api/pos/sale/pay-remaining
 * @desc Pay remaining transaction debt
 */
router.post("/pay-remaining", authenticate, payRemainingHandler);

/**
 * @route POST /api/pos/sale/return
 * @desc Return partial or full transaction
 */
router.post("/return", authenticate, returnHandler);

/**
 * @route GET /api/pos/sale/history
 * @desc Get all pos/sale 
 */
router.get("/history", authenticate, findAllHandler);

/**
 * @route GET /api/pos/sale/:invoiceNumber
 * @desc Get a transaction by ID
 */
router.get("/:invoiceNumber", authenticate, getByInvoiceIdHandler);

/**
 * @route GET /api/pos/sale/:id
 * @desc Get a transaction by ID
 */
router.get("/trx/:id", authenticate, getByIdHandler);

/**
 * @route GET /api/pos/sale/customer/:customerId
 * @desc Get all pos/sale of a specific customer
 */
router.get("/customer/:customerId", authenticate, findByCustomerHandler);

/**
 * @route PATCH /api/pos/sale/update/:id
 * @desc Update a transaction (alternative endpoint)
 */
router.patch("/update/:id", authenticate, findByCustomerHandler);

/**
 * @route DELETE /api/pos/sale
 * @desc Soft delete a transaction
 */
router.delete("/", authenticate, authorizeAdmin, deleteHandler);

export default router;
