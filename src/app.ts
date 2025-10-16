// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './modules/auth/auth.routes'; // we will create an index.ts inside modules later
import costumerRoutes from './modules/auth/auth.routes'; // we will create an index.ts inside modules later
import transactionRoutes from './modules/auth/auth.routes'; // we will create an index.ts inside modules later
import { errorHandler } from './middleware/error.middleware';
import dotenv from 'dotenv';
import connectDB from './database/connection';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/usama-backend';
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

app.use('/api/v1/user', userRoutes); // mount all feature modules here
app.use('/api/v1/costumer', costumerRoutes); // mount all feature modules here
app.use('/api/v1/transaction', transactionRoutes); // mount all feature modules here

// ====== Error Handling ======
app.use(errorHandler);

// ====== 404 Handler ======
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
