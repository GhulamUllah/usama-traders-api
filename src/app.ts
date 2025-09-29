// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../src/modules/auth/auth.routes'; // we will create an index.ts inside modules later
import { errorHandler } from './middleware/error.middleware';

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

app.use('/api/v1', routes); // mount all feature modules here

// ====== Error Handling ======
app.use(errorHandler);

// ====== 404 Handler ======
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
