// src/modules/costumer/costumer.routes.ts

import { Router } from 'express';
import { createHandler, deleteHandler, findAllHandler, updateHandler } from './costumer.controller';

const router = Router();

router.post('/create', createHandler);
router.post('/update', updateHandler);
router.post('/delete', deleteHandler);
router.get('/all', findAllHandler);

export default router;
