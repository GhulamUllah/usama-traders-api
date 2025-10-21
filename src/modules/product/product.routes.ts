// src/modules/costumer/costumer.routes.ts

import { Router } from 'express';
import { createHandler, deleteHandler, findAllHandler, updateHandler } from './product.controller';
import { authenticate, authorizeAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create', authenticate, createHandler);
router.post('/update', authenticate, updateHandler);
router.delete('/delete', authenticate, authorizeAdmin, deleteHandler);
router.get('/all/:shopId', authenticate, findAllHandler);

export default router;
