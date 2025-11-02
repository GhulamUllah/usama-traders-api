// src/modules/customer/customer.routes.ts

import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  findAllHandler,
  getUserShopHandler,
  updateHandler,
} from "./shop.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, authorizeAdmin, createHandler);
router.post("/update", authenticate, authorizeAdmin, updateHandler);
router.delete("/delete", authenticate, authorizeAdmin, deleteHandler);
router.get("/all", authenticate, authorizeAdmin, findAllHandler);
router.get("/user-shop", authenticate, getUserShopHandler);

export default router;
