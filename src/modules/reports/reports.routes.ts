import { Router } from 'express';
import { getSalesReportController } from './reports.controller';

const router = Router();

router.get('/customer-sales', getSalesReportController);

export default router;
