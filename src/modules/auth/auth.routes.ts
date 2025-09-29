// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { registerHandler, loginHandler } from './auth.controller';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
router.post('/register', registerHandler);

/**
 * @route POST /api/auth/login
 * @desc Login existing user
 */
router.post('/login', loginHandler);

export default router;
