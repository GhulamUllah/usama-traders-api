// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './modules/auth/auth.routes'; // we will create an index.ts inside modules later
import costumerRoutes from './modules/costumer/costumer.routes'; // we will create an index.ts inside modules later
import transactionRoutes from './modules/transaction/transaction.routes'; // we will create an index.ts inside modules later
import productRoutes from './modules/product/product.routes'; // we will create an index.ts inside modules later
import shopRoutes from './modules/shop/shop.routes'; // we will create an index.ts inside modules later
import { errorHandler } from './middleware/error.middleware';
import dotenv from 'dotenv';
import connectDB from './database/connection';
import getStatistics from './general.statistics';
dotenv.config();
const app: Application = express();

// ====== Middlewares ======
app.use(helmet()); // security headers
app.use(cors()); // CORS support
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form-data
app.use(morgan('dev')); // logging

// ====== Routes ======
app.get('/', async (req: Request, res: Response) => {
  try {
    await connectDB();
    res.json({ success: true, message: 'API is running 🚀' });
  } catch (err: any) {
    res.json({ success: false, message: 'DATABASE UNABLE TO CONNECT 🚀' });
  }
});

app.get('/api/v1/statistics', getStatistics); // mount all feature modules here
app.use('/api/v1/user', userRoutes); // mount all feature modules here
app.use('/api/v1/costumer', costumerRoutes); // mount all feature modules here
app.use('/api/v1/pos/sale', transactionRoutes); // mount all feature modules here
app.use('/api/v1/product', productRoutes); // mount all feature modules here
app.use('/api/v1/shop', shopRoutes); // mount all feature modules here

// ====== Error Handling ======
app.use(errorHandler);

// ====== 404 Handler ======
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
