// src/modules/costumer/costumer.routes.ts

import { Router } from 'express';
import { createHandler, deleteHandler, findAllHandler, getUserShopHandler, updateHandler } from './shop.controller';
import { authenticate, authorizeAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create', authenticate, createHandler);
router.post('/update', authenticate, updateHandler);
router.delete('/delete', authenticate, authorizeAdmin, deleteHandler);
router.get('/all', authenticate, findAllHandler);
router.get('/user-shop', authenticate, getUserShopHandler);

export default router;
