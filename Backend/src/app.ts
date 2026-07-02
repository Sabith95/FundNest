import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import { corsOptions } from './config/cors';
import { requestLogger } from './interfaces/http/middleware/requestLogger';
import { errorHandler } from './interfaces/http/middleware/errorHandler';
import { notFound } from './interfaces/http/middleware/notFound';   
import apiRouter from './interfaces/http/routes/index';

const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(cookieParser())


  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(requestLogger);
  app.use('/uploads', express.static('uploads'));

  app.use('/api/v1', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;