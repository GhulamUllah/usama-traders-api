// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './modules/auth/auth.routes'; // we will create an index.ts inside modules later
import { errorHandler } from './middleware/error.middleware';
import dotenv from 'dotenv';
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
app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is running 🚀' });
});
app.get('/health', async (req, res) => {
  try {
    const dbState = (await import('mongoose')).default.connection.readyState;
    res.json({ success: true, dbState, MONGO_URI });
    // 1 = connected, 2 = connecting, 0 = disconnected
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.use('/api/v1', routes); // mount all feature modules here

// ====== Error Handling ======
app.use(errorHandler);

// ====== 404 Handler ======
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
