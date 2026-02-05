import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimitMiddleware } from './middlewares/rateLimit.js';
import { env } from './config/index.js';
import routes from './routes/index.js';

const app = express();

// Environment-based CORS configuration
const corsOptions = {
  origin:
    env.NODE_ENV === 'production'
      ? ['https://yourdomain.com', 'https://www.yourdomain.com']
      : env.CORS_ORIGINS.length > 0
        ? env.CORS_ORIGINS
        : [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://localhost:3001',
          ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);

app.use('/api', routes);

app.use(errorHandler);

export { app };
