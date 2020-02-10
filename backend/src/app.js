/**
 * Module dependencies.
 */
import cors from "cors";
import helmet from "helmet";
import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes';
import config from "./config";

// Create express app
var app = express();

// Configure CORS
app.use(cors())
app.use(helmet())

// Config express app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Config routes for express
app.use('/', routes.home);
app.use('/tasks', routes.tasks);
app.use('/auth', routes.auth)

export default app;
