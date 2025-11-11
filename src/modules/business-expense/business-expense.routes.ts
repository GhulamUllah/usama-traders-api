// src/modules/customer/customer.routes.ts

import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  findAllHandler,
  updateHandler,
} from "./business-expense.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, authorizeAdmin, createHandler);
router.post("/update", authenticate, authorizeAdmin, updateHandler);
router.delete("/delete", authenticate, authorizeAdmin, deleteHandler);
router.get("/all", authenticate, authorizeAdmin, findAllHandler);

export default router;
