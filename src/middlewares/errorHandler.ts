// filename: src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * @class HttpError
 * @extends Error
 * @description Custom error class for HTTP errors.
 */
export class HttpError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.flatten().fieldErrors,
    });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};