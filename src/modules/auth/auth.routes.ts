// src/modules/auth/auth.routes.ts

import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  getAllUsersHandler,
  approveUserHandler,
  deleteUserHandler,
  assignShopHandler,
  profileHandler
} from "./auth.controller";
import { authenticate, authorizeAdmin } from "../../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
router.post("/register", registerHandler);

/**
 * @route POST /api/auth/login
 * @desc Login existing user
 */
router.post("/login", loginHandler);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 */
router.get('/profile', authenticate, profileHandler);

/**
 * @route GET /api/auth/users
 * @desc Get all users (admin level)
 */
router.get("/all", authenticate, authorizeAdmin, getAllUsersHandler);

/**
 * @route POST /api/auth/approve
 * @desc Approve a user (admin level)
 */
router.post("/approve", authenticate, authorizeAdmin, approveUserHandler);

/**
 * @route POST /api/auth/assign-shop
 * @desc Assign a shop to the user (admin level)
 */
router.post("/assign-shop", authenticate, authorizeAdmin, assignShopHandler);

/**
 * @route DELETE /api/auth/delete
 * @desc Delete a user (admin level)
 */
router.delete("/delete", authenticate, authorizeAdmin, deleteUserHandler);

/**
 * Note: Middleware for authentication and authorization should be added to protect routes as necessary.
 */

export default router;
