import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../utils/index.js';

export const notFound = (req, _res, next) => {
  next(new AppError(`No API route found for ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong.';
  let details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Please check the information you provided.';
    details = err.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
  } else if (err.name === 'CastError' || err instanceof mongoose.Error.CastError) {
    statusCode = 404;
    message = 'The requested item could not be found.';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'That record already exists.';
  }

  if (statusCode >= 500) console.error('[error]', err);

  res.status(statusCode).json({
    message,
    ...(details ? { details } : {}),
  });
};
