// src/modules/customer/customer.routes.ts

import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  findAllHandler,
  getByIdHandler,
  resetHandler,
  updateHandler,
} from "./salesman.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, createHandler);
router.post("/update", authenticate, updateHandler);
router.patch("/reset", authenticate, authorizeAdmin, resetHandler);
router.delete("/delete", authenticate, authorizeAdmin, deleteHandler);
router.get("/all", authenticate, findAllHandler);
router.get("/id/:salesmanId", authenticate, getByIdHandler);

export default router;
